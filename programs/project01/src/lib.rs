use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod states;

pub use constants::*;
pub use instructions::initialize::*;
pub use states::config_account::*;

declare_id!("9NRU7WAPGifEpgPT3w1rF593G6VnnGLDKMEsc4Zy5idJ");

#[program]
pub mod project01 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, owner: Pubkey, creator: Pubkey) -> Result<()> {
        _initialize(ctx, owner, creator)
    }
}
