import * as token from '@solana/spl-token';
import * as web3 from '@solana/web3.js';

async function main() {
    
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"))    
    let secretKey = Uint8Array.from([])
    
    let user = web3.Keypair.fromSecretKey(secretKey);    
    const mint = await createNewMint(connection, user, user.publicKey, user.publicKey, 2);

    // might need to wait for a bit until everything gets created

    const mintInfo = await token.getMint(connection, mint);

    console.log("mintinfo address:",mintInfo.address);

    // Token Accounts are used to hold Tokens of a specific Token Mint
    const tokenAccount = await createTokenAccount(
        connection,
        user,
        mint,
        user.publicKey
    );

    console.log("token account address:", tokenAccount.address);


    console.log('now that you have mint and account token mint - house the mint - now you can start your minting process');

    await mintTokens(
        connection,
        user,
        mint,
        tokenAccount.address,
        user,
        100 * 10 ** mintInfo.decimals
    );

}

// whooohoooo - minting account 
async function mintTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    destination: web3.PublicKey,
    authority: web3.Keypair,
    amount: number
) {
    const transactionSignature = await token.mintTo(
        connection,
        payer,
        mint,
        destination,
        authority,
        amount
    )

    console.log(
        `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}


async function createTokenAccount(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    owner: web3.PublicKey
) {
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        owner
    )

    console.log(
        `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
    )

    return tokenAccount
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
                