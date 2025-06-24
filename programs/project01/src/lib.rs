use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod states;

pub use constants::*;
pub use error::*;
pub use instructions::{create_pool::*, initialize::*};
pub use states::{config_account::*, pool_account::*};

declare_id!("9NRU7WAPGifEpgPT3w1rF593G6VnnGLDKMEsc4Zy5idJ");

#[program]
pub mod project01 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, owner: Pubkey, creator: Pubkey) -> Result<()> {
        _initialize(ctx, owner, creator)
    }

    pub fn create_pool(
        ctx: Context<CreatePool>,
        start_time: u64,
        end_time: u64,
        claim_time: u64,
        token_for_sale: u64,
        token_decimals: u8,
        token_rate: u64,
        decimals: u8,
        currency: Pubkey,
        token: Pubkey,
        signer: Pubkey,
    ) -> Result<()> {
        _create_pool(
            ctx,
            start_time,
            end_time,
            claim_time,
            token_for_sale,
            token_decimals,
            token_rate,
            decimals,
            currency,
            token,
            signer,
        )
    }
}
