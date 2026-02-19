use near_sdk::{near, env, AccountId, NearToken, PanicOnDefault};
use near_sdk::collections::LookupMap;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct BuggyVault {
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

    // TODO: implement withdraw

    pub fn get_balance(&self, account: AccountId) -> u128 {
        self.balances.get(&account).unwrap_or(0)
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner.clone()
    }
}
