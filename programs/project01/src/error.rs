use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorMessage {
    #[msg("End time must be greater than start time.")]
    InvalidTimePeriod,

    #[msg("Claim time must be between start time and end time.")]
    InvalidClaimTime,

    #[msg("Token for sale must be greater than zero.")]
    InvalidTokenAmount,

    #[msg("Token rate must be greater than zero.")]
    InvalidTokenRate,

    #[msg("Decimals must be less than or equal to 18.")]
    InvalidDecimals,

    #[msg("Invalid currency address.")]
    InvalidCurrency,

    #[msg("Invalid token address.")]
    InvalidToken,

    #[msg("Unauthorized")]
    Unauthorized,

    #[msg("Pool has ended.")]
    PoolEnded,

    #[msg("Insufficient tokens available.")]
    InsufficientTokens,

    #[msg("The pool has not ended yet.")]
    PoolNotEnded,

    #[msg("No tokens to claim.")]
    NoTokensToClaim,
}
