import * as bcrypt from 'bcrypt';

//encrypt password
export const encrypt = async (password: string): Promise<string> => {
    try {
        const saltRound: number = 10;
        const salt: any = bcrypt.genSaltSync(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.log(error);
        throw new Error("password processing faild");
    }

}

//compare password
export const compare = async (planText: string, hash: string): Promise<boolean> => {
    const match = await bcrypt.compareSync(planText, hash)
    return match;
}