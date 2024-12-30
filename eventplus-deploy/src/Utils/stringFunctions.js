export const dateFormatDbToView = data => {

    data = data.substr(0, 10);
    data = data.split("-"); 

    return `${data[2]}/${data[1]}/${data[0]}`;
}

export const dateFormateDbToView =  date => {
    
    date = date.substr(0, 10)
    date = date.split('-')
    
    return date = `${date[2]}/${date[1]}/${date[0]}`
}

export const dateFormateViewToDb =  date => {
    
    date = date.split('/')
    
    return date = `${date[2]}/${date[1]}/${date[0]}`
}
export const truncateDateFromDb =  date => date.substr(0,10)