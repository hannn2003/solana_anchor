use anchor_lang::prelude::*;

use crate::{Config, CONFIG_SEED};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init, payer = signer,
        space = Config::LEN,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, Config>,

    // System program
    pub system_program: Program<'info, System>,
}

pub fn _initialize(ctx: Context<Initialize>, owner: Pubkey, creator: Pubkey) -> Result<()> {
    let config_account = &mut ctx.accounts.config;
    config_account.owner = owner.key();
    config_account.creator = creator.key();
    Ok(())
}
