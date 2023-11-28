import axios from "axios";

const enum ApiUrl {
    Local = 'https://localhost:5001/api/',
    Staging = '',
    Production = ''
}

export const getApiUrl = (): ApiUrl | undefined => {
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

/* export default axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-type": "application/json"
    }
}); */