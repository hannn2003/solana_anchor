use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorMessage {
    #[msg("Pool has ended.")]
    PoolEnded,

    #[msg("Insufficient tokens available.")]
    InsufficientTokens,

    #[msg("The pool has not ended yet.")]
    PoolNotEnded,

    #[msg("No tokens to claim.")]
    NoTokensToClaim,
}
