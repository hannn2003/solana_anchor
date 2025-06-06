use anchor_lang::prelude::*;

declare_id!("9NRU7WAPGifEpgPT3w1rF593G6VnnGLDKMEsc4Zy5idJ");

#[program]
pub mod project01 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
