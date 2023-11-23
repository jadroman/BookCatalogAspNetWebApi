


const enum ApiUrl {
    Local = 'https://localhost:5001/api/',
    Staging = '',
    Production = ''
}

const getApiUrl = () => {
    console.log('process.env.NODE_ENV=> '+ process.env.NODE_ENV);
    let url;
    switch (process.env.NODE_ENV) {
        case 'development':
            url = ApiUrl.Local
            break;
        case 'production':
            url = ApiUrl.Production;
            break;
    }

    return url;
}

export default getApiUrl;