use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod states;

pub use constants::*;
pub use error::*;
pub use instructions::{create_pool::*, initialize::*};
pub use states::{config_account::*, pool::*};

declare_id!("9NRU7WAPGifEpgPT3w1rF593G6VnnGLDKMEsc4Zy5idJ");

#[program]
pub mod project01 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, owner: Pubkey, creator: Pubkey) -> Result<()> {
        _initialize(ctx, owner, creator)
    }

    pub fn create_pool(
        ctx: Context<CreatePool>,
        start_time: i64,
        reward_time: i64,
        reward_per_period: u64,
    ) -> Result<()> {
        _create_pool(ctx, start_time, reward_time, reward_per_period)
    }
}
