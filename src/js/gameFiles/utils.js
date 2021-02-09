export const setBoxSize = () => {
    if(window.innerWidth < window.innerHeight * .62) return window.innerHeight * 0.5 / 10 
    return  window.innerHeight * 0.6 / 10 
}
