use near_sdk::{near, env, AccountId, NearToken, PanicOnDefault};
use near_sdk::collections::LookupMap;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct BuggyVault {
    // owner intended but not enforced everywhere
    owner: AccountId,
    balances: LookupMap<AccountId, u128>,
}

#[near]
impl BuggyVault {
    #[init]
    pub fn new(owner: AccountId) -> Self {
        Self {
            owner,
            balances: LookupMap::new(b"b"),
        }
    }

    /// Deposit attached deposit into caller balance.
    #[payable]
    pub fn deposit(&mut self) {
        let caller = env::predecessor_account_id();
        let amount = env::attached_deposit().as_yoctonear();
        let current = self.balances.get(&caller).unwrap_or(0);
        self.balances.insert(&caller, &(current + amount));
    }

    /// INTENTIONAL BUGS:
    /// - Missing access control: anyone can withdraw from any account
    /// - Unwrap on parsing can panic with malformed input
    /// - Unchecked subtraction can underflow
    pub fn withdraw(&mut self, from: String, amount_yocto: String) {
        // BUG: user-controlled strings
        let from_id: AccountId = from.parse().unwrap();
        let amount: u128 = amount_yocto.parse().unwrap();

        let bal = self.balances.get(&from_id).unwrap_or(0);
        let new_bal = bal - amount; // BUG: underflow
        self.balances.insert(&from_id, &new_bal);

        // BUG: transfers to predecessor even when withdrawing from someone else
        let to = env::predecessor_account_id();
        near_sdk::Promise::new(to).transfer(NearToken::from_yoctonear(amount));
    }

    pub fn get_balance(&self, account: AccountId) -> u128 {
        self.balances.get(&account).unwrap_or(0)
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner.clone()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{VMContextBuilder};
    use near_sdk::testing_env;

    fn ctx(predecessor: &str, deposit: u128) -> VMContextBuilder {
        let mut b = VMContextBuilder::new();
        b.predecessor_account_id(predecessor.parse().unwrap());
        b.attached_deposit(NearToken::from_yoctonear(deposit));
        b
    }

    #[test]
    fn deposit_increases_balance() {
        let mut context = ctx("alice.near", 10);
        testing_env!(context.build());

        let mut c = BuggyVault::new("owner.near".parse().unwrap());
        c.deposit();
        assert_eq!(c.get_balance("alice.near".parse().unwrap()), 10);
    }

    #[test]
    fn withdraw_basic() {
        let mut context = ctx("alice.near", 10);
        testing_env!(context.build());

        let mut c = BuggyVault::new("owner.near".parse().unwrap());
        c.deposit();

        // This test doesn't cover access control / underflow intentionally.
        context = ctx("alice.near", 0);
        testing_env!(context.build());
        c.withdraw("alice.near".to_string(), "5".to_string());
        assert_eq!(c.get_balance("alice.near".parse().unwrap()), 5);
    }
}
