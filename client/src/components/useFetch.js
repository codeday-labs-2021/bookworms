import {useState, useEffect, useCallback} from 'react';

/**
 * A custom hook to fetch data
 * 
 * @param url the url for fetching
 * @param method the method for fetching
 * @param dataSend the data to send to database, if any
 */

const useFetch = (url, method, dataSend = null) => {
    // things we want to get out after fetching
    const [data, setData] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    // catch error, if any
    const catchErr = (response) => {
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            setError(message);
            setIsPending(false);
            return true;
        } 
        return false;
    }

    const handlePost = useCallback(async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // convert the React state to JSON and send it as the POST body
            body: JSON.stringify(dataSend)
        })
        if (!catchErr(response)) {
            setIsPending(false);
        }
    }, [url, dataSend]);

    const handleGet = useCallback(async () => {
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Accept': 'application/json'},
        });

        if (!catchErr(response)){
            const reviewsArray = await response.json();
            setData(reviewsArray.data);
            setIsPending(false);
        }
    }, [url]);

    // determine which request 
    const getMethod = useCallback(() => {
        if (method === 'POST') {
            handlePost();
        } else {
            handleGet();
        }
    }, [method, handlePost, handleGet]);


    useEffect(() => getMethod(), [url, method, getMethod]);

    return {data, isPending, error};
}

export default useFetch;