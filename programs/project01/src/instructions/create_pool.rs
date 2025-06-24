use anchor_lang::prelude::*;

use crate::{Config, ErrorMessage, PoolAccount, CONFIG_SEED, POOL_SEED};

#[derive(Accounts)]
#[instruction(
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
)]
pub struct CreatePool<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      init, payer=signer, 
      space=PoolAccount::LEN, 
      seeds=[POOL_SEED, token.key().as_ref()], 
      bump
    )]
    pub pool_account: Account<'info, PoolAccount>,
  
    #[account(
      seeds = [CONFIG_SEED],
      constraint = config_account.creator.key() == signer.key() @ErrorMessage::Unauthorized,
      bump
    )]
    pub config_account: Account<'info, Config>,

    // System program
    pub system_program: Program<'info, System>,
}


pub fn _create_pool(ctx: Context<CreatePool>, 
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
  ) -> Result<()>{
    require!(end_time > start_time, ErrorMessage::InvalidTimePeriod);
    require!(token_for_sale > 0, ErrorMessage::InvalidTokenAmount);
    require!(token_rate > 0, ErrorMessage::InvalidTokenAmount);
    require!(token_decimals <= 18, ErrorMessage::InvalidDecimals);
    require!(decimals <= 18, ErrorMessage::InvalidDecimals);
    require!(currency != Pubkey::default(), ErrorMessage::InvalidCurrency);
    require!(token != Pubkey::default(), ErrorMessage::InvalidToken);
    
    let pool = &mut ctx.accounts.pool_account;
    pool.start_time = start_time;
    pool.end_time = end_time;
    pool.claim_time = claim_time;
    pool.token_for_sale = token_for_sale;
    pool.token_decimals = token_decimals;
    pool.token_rate = token_rate;
    pool.decimals = decimals;
    pool.currency = currency.key();
    pool.token = token.key();
    pool.signer = signer.key();
    Ok(())
}