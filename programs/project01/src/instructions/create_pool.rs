use anchor_lang::prelude::*;

use crate::{Pool, POOL_SEED};

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      init, payer=signer, 
      space=Pool::LEN, 
      seeds=[POOL_SEED], 
      bump
    )]
    pub pool: Account<'info, Pool>,
  
    // System program
    pub system_program: Program<'info, System>,
}


pub fn _create_pool(ctx: Context<CreatePool>, start_time: i64,
    reward_time: i64,
    reward_per_period: u64) -> Result<()>{
    // require!(end_time > start_time, ErrorMessage::InvalidTimePeriod);
    let pool = &mut ctx.accounts.pool;
    pool.start_time = start_time;
    pool.end_time = start_time + 15 * 60;
    pool.reward_time = reward_time;
    pool.reward_per_period = reward_per_period;
    pool.staked_amount = 0;
    pool.claimed = false;
    Ok(())
}