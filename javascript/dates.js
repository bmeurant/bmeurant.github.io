export {getYears}

function getYears(birthdate) {
    const bd = new Date(birthdate);  
    const nbMonths = Date.now() - bd.getTime();  
    const year = new Date(nbMonths).getUTCFullYear();  

    return Math.abs(year - 1970);
}