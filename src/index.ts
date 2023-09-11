import * as token from '@solana/spl-token';
import * as web3 from '@solana/web3.js';

async function main() {
    
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"))    
    let secretKey = Uint8Array.from([])
    
    let user = web3.Keypair.fromSecretKey(secretKey);    
    const mint = await createNewMint(connection, user, user.publicKey, user.publicKey, 2);

    // might need to wait for a bit until everything gets created

    const mintInfo = await token.getMint(connection, mint);        
}
    
    
    async function createNewMint(
        connection: web3.Connection,
        payer: web3.Keypair,
        mintAuthority: web3.PublicKey,
        freezeAuthority: web3.PublicKey,
        decimals: number
        ): Promise<web3.PublicKey> {
            
            const tokenMint = await token.createMint(
                connection,
                payer,
                mintAuthority,
                freezeAuthority,
                decimals
                );
                
                console.log(
                    `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
                    );
                    
                    return tokenMint;
                }
                
                main()
                .then(() => {
                    console.log("Finished successfully")
                    process.exit(0)
                })
                .catch((error) => {
                    console.log(error)
                    process.exit(1)
                })
                