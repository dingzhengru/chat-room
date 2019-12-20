import { db, firebase } from '../firebase.js'



// lobby object

/* 
{
    id: 0,
    name: '',
    content: '',
}
*/

export default {
    namespaced: true,
    state: {
        collection: 'lobby',
        data: null,
        content: '',
    },
    getters: {
        getData: (state) => {
            return state.data;
        },
        getDataById: (state) => (id) => {
            let data = state.data || [];
            return data.find(item => item.id == id)
        },
        getContent: (state) => {
            return state.content;
        },
    },
    mutations: {
        setData(state, payload) {
            state.data = payload;
        },
        setContent(state, payload) {
            state.content = payload;
        },
    },
    actions: {
        setWatchDataAction({ state, commit }, payload) {
            db.collection(state.collection)
            .orderBy('id')
            .onSnapshot(snapshot => {
                let data = snapshot.docs.map(doc => doc.data());
                commit('setData', data);
            });
        },
        getDataAction({ state, commit }, payload) {

            // state.data 固定用id排序，不要去動到他本身

            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .orderBy('id')
                .get()
                .then(snapshot => {
                    let data = snapshot.docs.map(doc => doc.data());
                    commit('setData', data);
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
            })
        },
        addDataAction({ state, commit, dispatch }, payload) {

            let data = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection(state.collection).orderBy('id', 'desc').limit(1).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        data.id = Number(doc.data().id) + 1;
                        data.created = new Date(Date.now());
                        data.editDate = data.created;
                        data.latestPostDate = data.created;

                        db.collection(state.collection).add(data)
                        .then(() => {
                            // update data(更新state的資料)

                            // dispatch('getDataAction');
                            resolve(data);
                        })
                    })
                })
                .catch(error => {
                    reject(error.message);
                })
            })
        },
        removeDataAction({ state, commit, dispatch }, payload) {

            let data = payload;

            return new Promise((resolve, reject) => {
                db.collection(state.collection).where('id', '==', data.id).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete()
                        .then(() => {
                            // update data(更新state的資料)
                            dispatch('getDataAction');
                            resolve(data);
                        })
                    })
                })
                .catch(error => {
                    reject(error.message);
                })
            })
        },
        updateDataAction({ state, commit, dispatch }, payload) {
            // 這裡不使用 dispatch('getDataAction') 更新，避免執行太多次

            let data = payload;

            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .where('id', '==', data.id).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        let docData = doc.data()
                        
                        doc.ref.update(data)
                        .then(() => {
                            // update data(更新state的資料)
                            dispatch('getDataAction');
                            resolve(data);
                        })
                    })
                })
                .catch(error => {
                    reject(error);
                })
            })
        }
    },
}


