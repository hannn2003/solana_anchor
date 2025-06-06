use anchor_lang::prelude::*;
pub mod constants;
use constants::CONFIG_SEED;

declare_id!("9NRU7WAPGifEpgPT3w1rF593G6VnnGLDKMEsc4Zy5idJ");

#[program]
pub mod project01 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        let config = &mut ctx.accounts.config;
        config.owner = ctx.accounts.owner.key();
        config.creator = ctx.accounts.creator.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 32,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, Config>,

    // The owner of the platform
    pub owner: Signer<'info>,

    // The creator who pays the rent/init
    #[account(mut)]
    pub creator: Signer<'info>,

    // System program
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Config {
    pub owner: Pubkey,
    pub creator: Pubkey,
}
