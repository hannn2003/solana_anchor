use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub start_time: i64,
    pub end_time: i64,
    pub reward_time: i64,
    pub reward_per_period: u64,
    pub staked_amount: u64,
    pub claimed: bool,
}

impl Pool {
    pub const LEN: usize = 8 + Pool::INIT_SPACE;
}
