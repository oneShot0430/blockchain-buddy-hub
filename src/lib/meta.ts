export function findToken(tokens, blockchain: string, address: string | null) {
    const token = tokens.find(token =>
        token.blockchain === blockchain && token.address == address
    )
    if (!token) {
        throw new Error(`There was no token with blockchain=${blockchain} & address=${address}`)
    }
    return token
}