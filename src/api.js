import axios from "axios";


const API_MURABAHA = "https://murabaha.cbk.kg/"
const CALLBACK_API_V1 = "callback/api/v1/"

export const postFeedback = async (payload) => {
    try {
        const { data } = await axios.post(`${API_MURABAHA}${CALLBACK_API_V1}send`, payload);
        return data;  
    } catch (error) {
        console.error('Error posting feedback:', error);
        throw error; 
    }
}


export const getPercent = async () => {
    console.log('get percent');
    
    try {
        const { data } = await axios(`${API_MURABAHA}${CALLBACK_API_V1}percent`)
        return data
    } catch (error) {
        console.error('Error geting percent', error)
        throw error
    }
}

export const getStartPaymentPercent = async (payload) => {
    console.log(payload.queryKey, 'fetch percent 10 or 30');
    
    try {
        const { data } = await axios(`${API_MURABAHA}${CALLBACK_API_V1}percent${payload.queryKey[1]}`)
        return data
    } catch (error) {
        console.error('Error geting percent', error)
        throw error
    }
}

export const postAutoFinance = async (payload) => {
    const {topic, ...rest} = payload.details
    payload.details = String(JSON.stringify(payload.details))
    const boundaryVal = new Date().getUTCMilliseconds() ** 5

    try {
        const { res } = await axios.post(`${API_MURABAHA}${CALLBACK_API_V1}${topic}`, payload, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=---------${boundaryVal}`,
            },
          });
        return res;  
    } catch (error) {
        console.error('Error posting autofinanse:', error);
        throw error; 
    }
}


// Banda panda API`s

export const getPandaBandaInvest = async () => {
    try {
        const { data } = await axios(`${API_MURABAHA}${CALLBACK_API_V1}percent/getPandaBandaInvest`)
        return data
    } catch (error) {
        console.error('Error geting investment', error)
        throw error
    }
}

export const getNoDeposit = async (payload) => {
    try {
        const { data } = await axios(`${API_MURABAHA}${CALLBACK_API_V1}percent/${payload.queryKey[1]}`)
        return data
    } catch (error) {
        console.error('Error geting percent', error)
        throw error
    }
}

