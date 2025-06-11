use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub owner: Pubkey,
    pub creator: Pubkey,
}

impl Config {
    pub const LEN: usize = 8 + Config::INIT_SPACE;
}
