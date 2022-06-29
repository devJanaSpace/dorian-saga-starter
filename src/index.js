import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import axios from 'axios';
// "takeEvery" will inform watcher saga, "put" will allow us to make dipatches from this file
import { takeEvery, put } from 'redux-saga/effects'; 

const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

const ships = ( state =[], action ) =>{
    if( action.type === 'SET_SHIPS' ){
        return action.payload;
    }
    return state;
} // end ships reducer

// this is the saga that will watch for actions
function* watcherSaga() { // AKA "rootSaga"
    yield takeEvery( 'GET_ELEMENTS', getElements ); // when we receive a type of "GET_ELEMENTS", run this function
    yield takeEvery( 'GET_SHIPS', getShips );
}

function* getElements(){
    try{
        // get call for our data
        const response = yield axios.get( '/api/element' );
        // send this data to our reducer
        yield put( { type: 'SET_ELEMENTS', payload: response.data } );
    }catch( err ){
        console.log( err );
        alert( 'uh oh' );
    } // end try/catch
} // end getElements

function* getShips(){
    try{
        const response = yield axios.get( 'https://swapi.dev/api/starships' );
        yield put( { type: 'SET_SHIPS', payload: response.data } );
    }catch( err ){
        console.log( err );
        alert( 'nope' );
    }
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
        ships
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(watcherSaga);

ReactDOM.render(
    <Provider store={storeInstance}>
        <App/>
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
