

export const random = ()=>{
    const randomText = "abcdefghijklmnopqrstuvwxyz";
    let res="";
    for(let i=0;i<randomText.length;i++){
        res+=randomText[Math.floor(Math.random() * randomText.length)]
        return res;
    }
}