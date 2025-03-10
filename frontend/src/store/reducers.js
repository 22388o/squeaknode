import type from './typeActions'


const initialState = {
    session: true,
    loggedin: false,
    network: null,
    squeaks: [],
    squeak: null,
    ancestorSqueaks: [],
    replySqueaks: [],
    searchSqueaks: [],
    squeakOffers: [],
    account: null,
    user: null,
    userSqueaks: [],
    bookmarks: [],
    recent_squeaks: [],
    lists: [],
    list: null,
    trends: [],
    result: [],
    tagSqueaks: [],
    followers: [],
    following: [],
    resultUsers: [],
    suggestions: [],
    signingProfiles: [],
    contactProfiles: [],
    connectedPeers: [],
    peers: [],
    peer: null,
    peerConnection: null,
    top: '-100px',
    msg: '',
    conversations: null,
    conversation: null,
    paymentSummary: null,
    sentPayments: [],
    receivedPayments: [],
    privateKey: null,
    externalAddress: null,
    sellPrice: null,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_STATE:
            return {...state, ...action.payload }

        case type.ERROR:
            // message.error(action.payload.msg? action.payload.msg : action.payload == 'Unauthorized' ? 'You need to sign in' : 'error');
            return {...state, loading: false, error: true, msg: action.payload.msg}

        case type.LOGIN:
            localStorage.setItem("Twittertoken", action.payload.token)
            return {...state, ...action.payload, loggedin: true, loading: false, error: false}

        case type.LOGOUT:
            window.location.replace('/')
            return {...state, ...action.payload}

        case type.REGISTER:
            setTimeout(()=>{action.data.func()},250)
            return {...state, ...action.payload, loading: false, error: false}

        case type.GET_NETWORK:
            return {...state, ...action.payload, loading: false, error: false}

        case type.TWEET:
            let recentT = state.squeaks
            let s_squeak = state.squeak
            let replyT = state.replySqueaks
            recentT.unshift(action.payload.squeak)
            if(s_squeak && s_squeak.getSqueakHash() === action.data.replyTo){
                // Update the replies if the current selected squeak is active.
                replyT.unshift(action.payload.squeak)
            }
            // TODO: update `state.userSqueaks` with the new squeak.
            return {...state, loading: false, error: false}

        case type.UPDATE_TWEET:
            let updatedSqueakHash = action.payload.squeakHash
            let updatedSqueak = action.payload.squeak
            let userSqueaksU = state.userSqueaks
            let replySqueaksU = state.replySqueaks
            let ancestorSqueaksU = state.ancestorSqueaks
            let homeSqueaksU = state.squeaks
            let singleSqueakU = state.squeak
            userSqueaksU = userSqueaksU.map((x)=>{
                return x.getSqueakHash() === updatedSqueakHash ?
                updatedSqueak : x
            })
            replySqueaksU = replySqueaksU.map((x)=>{
                return x.getSqueakHash() === updatedSqueakHash ?
                updatedSqueak : x
            })
            ancestorSqueaksU = ancestorSqueaksU.map((x)=>{
                return x.getSqueakHash() === updatedSqueakHash ?
                updatedSqueak : x
            })
            homeSqueaksU = homeSqueaksU.map((x)=>{
                return x.getSqueakHash() === updatedSqueakHash ?
                updatedSqueak : x
            })
            if (singleSqueakU) {
              singleSqueakU = singleSqueakU.getSqueakHash() === updatedSqueakHash ? updatedSqueak : singleSqueakU;
            }
            return {
                ...state,
                ...{squeak: singleSqueakU},
                ...{userSqueaks: userSqueaksU},
                ...{replySqueaks: replySqueaksU},
                ...{ancestorSqueaks: ancestorSqueaksU},
                ...{squeaks: homeSqueaksU},
            }

        // case type.LIKE_TWEET:
        //     let account_likes = state.account
        //     let squeak_likes = state.squeaks
        //     let user_likes = state.user
        //     let Ssqueak_likes = state.squeak
        //     if(action.payload.msg === "liked"){
        //
        //         if(Ssqueak_likes){
        //             Ssqueak_likes.likes.push(action.data.id)
        //         }
        //
        //         account_likes.likes.push(action.data.id)
        //         squeak_likes.length && squeak_likes.find(x=>x._id === action.data.id).likes.push(account_likes._id)
        //
        //         if(action.data.dest === 'profile'){
        //             user_likes.squeaks.find(x=>x._id === action.data.id).likes.push(action.data.id)
        //             user_likes.likes = user_likes.squeaks.filter(x=>x._id === action.data.id).concat(user_likes.likes)
        //         }
        //
        //     }else if(action.payload.msg === "unliked"){
        //
        //         if(Ssqueak_likes){
        //             Ssqueak_likes.likes = Ssqueak_likes.likes.filter((x)=>{
        //                 return x !== action.data.id
        //              });
        //         }
        //
        //         squeak_likes.length && squeak_likes.find(x=>x._id === action.data.id).likes.pop()
        //         let likeIndex = account_likes.likes.indexOf(action.data.id)
        //         likeIndex > -1 && account_likes.likes.splice(likeIndex, 1)
        //
        //         if(action.data.dest === 'profile'){
        //             user_likes.squeaks.find(x=>x._id === action.data.id).likes.pop()
        //             user_likes.likes = user_likes.likes.filter((x)=>{
        //                return x._id !== action.data.id
        //             });
        //         }
        //     }
        //     return {...state, ...{account:account_likes}, ...{squeaks:squeak_likes}, ...{user: user_likes}, ...{squeak: Ssqueak_likes}}

        case type.GET_TWEETS:
            let timelineT = state.squeaks
            let newSqueaks = action.payload.squeaks
            newSqueaks.forEach(t => timelineT.push(t));
            return {...state, loading: false, error: false}

        case type.CLEAR_TWEETS:
            return {...state, ...{squeaks: []}}

        case type.GET_TWEET:
            return {...state, ...action.payload, loading: false, error: false}

        case type.GET_ACCOUNT:
            return {...state, ...action.payload}

        case type.GET_USER:
            return {...state, ...action.payload}

        case type.GET_USER_TWEETS:
            let userT = state.userSqueaks
            let newUserSqueaks = action.payload.userSqueaks
            newUserSqueaks.forEach(t => userT.push(t));
            return {...state, loading: false, error: false}

        case type.CLEAR_USER_TWEETS:
            return {...state, ...{userSqueaks: []}}

        case type.GET_ANCESTOR_TWEETS:
            return {...state, ...action.payload, loading: false, error: false}

        case type.GET_REPLY_TWEETS:
            return {...state, ...action.payload, loading: false, error: false}

        case type.GET_TWEET_OFFERS:
            return {...state, ...action.payload, loading: false, error: false}

        case type.DELETE_USER:
            let deletedUserSqueaks = state.userSqueaks
            deletedUserSqueaks.forEach((item, i) => {
              item.setAuthor(null);
            });
            return {...state, ...{user:null}, loading: false, error: false}

        case type.UPDATE_USER:
            let updateUser = action.payload.user
            let updateUserSqueaks = state.userSqueaks
            updateUserSqueaks.forEach((item, i) => {
              item.setAuthor(updateUser);
            });
            return {...state, ...{user:updateUser}, loading: false, error: false}

        case type.EXPORT_PRIVATE_KEY:
            return {...state, ...action.payload}

        case type.GET_EXTERNAL_ADDRESS:
            return {...state, ...action.payload}

        case type.GET_SELL_PRICE:
            return {...state, ...action.payload}

        case type.DELETE_TWEET:
            let deletedSqueakHash = action.payload.squeakHash
            let userSqueaksD = state.userSqueaks
            let replySqueaksD = state.replySqueaks
            let ancestorSqueaksD = state.ancestorSqueaks
            let homeSqueaksD = state.squeaks
            let singleSqueak = state.squeak
            userSqueaksD = userSqueaksD.filter((x)=>{
                    return x.getSqueakHash() !== deletedSqueakHash
            })
            ancestorSqueaksD = ancestorSqueaksD.filter((x)=>{
                    return x.getSqueakHash() !== deletedSqueakHash
            })
            replySqueaksD = replySqueaksD.filter((x)=>{
                    return x.getSqueakHash() !== deletedSqueakHash
            })
            if(singleSqueak && deletedSqueakHash === singleSqueak.getSqueakHash()){
                // window.location.replace('/home')
                singleSqueak = null
            }
            homeSqueaksD = homeSqueaksD.filter((x)=>{
                return x.getSqueakHash() !== deletedSqueakHash
            })
            return {
                ...state,
                ...{userSqueaks: userSqueaksD},
                ...{replySqueaks: replySqueaksD},
                ...{ancestorSqueaks: ancestorSqueaksD},
                ...{squeaks: homeSqueaksD},
                ...{squeak: singleSqueak}
            }

        case type.FOLLOW_USER:
            let followedUser = action.payload.user
            let followSP = state.signingProfiles
            let followCP = state.contactProfiles
            let newFollowSP = followSP.map(u => {
              return u.getPubkey() === followedUser.getPubkey() ?
              followedUser : u
            })
            let newFollowCP = followCP.map(u => {
              return u.getPubkey() === followedUser.getPubkey() ?
              followedUser : u
            })
            return {...state, ...{user: followedUser}, ...{signingProfiles: newFollowSP}, ...{contactProfiles: newFollowCP}}

        case type.UNFOLLOW_USER:
            let unfollowedUser = action.payload.user
            let unfollowSP = state.signingProfiles
            let unfollowCP = state.contactProfiles
            let newUnfollowSP = unfollowSP.map(u => {
              return u.getPubkey() === unfollowedUser.getPubkey() ?
              unfollowedUser : u
            })
            let newUnFollowCP = unfollowCP.map(u => {
              return u.getPubkey() === unfollowedUser.getPubkey() ?
              unfollowedUser : u
            })
            return {...state, ...{user: unfollowedUser}, ...{signingProfiles: newUnfollowSP}, ...{contactProfiles: newUnFollowCP}}

        case type.GET_LIST:
            return {...state, ...action.payload}

        case type.EDIT_LIST:
            ////
            return state

        case type.CREATE_LIST:
            let add_list = state.lists
            add_list.unshift(action.payload.list)
            return {...state, ...{lists: add_list}}

        case type.DELETE_LIST:
            ////
            return state

        case type.GET_LISTS:
            return {...state, ...action.payload}

        case type.GET_TREND:
            return {...state, ...action.payload}

        case type.CLEAR_SEARCH:
            return {...state, ...{searchSqueaks: []}}

        case type.SEARCH:
            let searchT = state.searchSqueaks
            let newSearchSqueaks = action.payload.searchSqueaks
            newSearchSqueaks.forEach(t => searchT.push(t));
            return {...state, loading: false, error: false}

        case type.TREND_TWEETS:
        let t_squeaks = action.payload.tagSqueaks.squeaks
            return {...state, ...{tagSqueaks: t_squeaks}}

        case type.ADD_TO_LIST:
            let added_list = state.list
            if(action.payload.msg === 'user removed'){
                added_list.users = added_list.users.filter(x=>{ return x._id !== action.data.userId })
            }else{
                added_list.users.push({username: action.data.username , _id: action.data.userId, name: action.data.name, profileImg: action.data.profileImg})
            }
            return {...state, ...{list: added_list}}

        case type.GET_FOLLOWERS:
            return {...state, ...action.payload}

        case type.GET_FOLLOWING:
            return {...state, ...action.payload}

        case type.CREATE_SIGNING_PROFILE:
            let createdSP = state.signingProfiles
            createdSP.push(action.payload.user)
            return {...state, loading: false, error: false}

        case type.CREATE_CONTACT_PROFILE:
            let createdContactUser = action.payload.user
            let createdCP = state.contactProfiles
            let updateCreatedContactUserSqueaks = state.userSqueaks
            createdCP.push(createdContactUser)
            updateCreatedContactUserSqueaks.forEach((item, i) => {
              item.setAuthor(createdContactUser);
            });
            return {...state, ...{user: createdContactUser}, loading: false, error: false}

        case type.GET_SIGNING_PROFILES:
            return {...state, ...action.payload}

        case type.GET_CONTACT_PROFILES:
            return {...state, ...action.payload}

        case type.GET_PAYMENT_SUMMARY:
            return {...state, ...action.payload}

        case type.GET_SENT_PAYMENTS:
            let paymentsSP = state.sentPayments
            let newSP = action.payload.sentPayments
            newSP.forEach(t => paymentsSP.push(t));
            return {...state, loading: false, error: false}

        case type.CLEAR_SENT_PAYMENTS:
            return {...state, ...{sentPayments: []}}

        case type.GET_RECEIVED_PAYMENTS:
            let paymentsRP = state.receivedPayments
            let newRP = action.payload.receivedPayments
            newRP.forEach(t => paymentsRP.push(t));
            return {...state, loading: false, error: false}

        case type.CLEAR_RECEIVED_PAYMENTS:
            return {...state, ...{receivedPayments: []}}

        case type.GET_CONNECTED_PEERS:
            return {...state, ...action.payload}

        case type.GET_PEERS:
            return {...state, ...action.payload}

        case type.GET_PEER_CONNECTION:
                return {...state, ...action.payload}

        case type.UPDATE_PEER:
            let updatePeer = action.payload.user
            return {...state, ...{peer: updatePeer}, loading: false, error: false}

        case type.SAVE_PEER:
            let createdPeer = action.payload.savedPeer
            let createdPeers = state.peers
            createdPeers.push(createdPeer)
            return {...state, ...{peers: createdPeers}, ...{peer: createdPeer}, loading: false, error: false}

        case type.SEARCH_USERS:
            return {...state, ...action.payload}

        case type.WHO_TO_FOLLOW:
            return {...state, ...action.payload}

        case type.GET_CONVERSATIONS:
            return {...state, ...action.payload}
        case type.START_CHAT:
            setTimeout(()=>{action.data.func()},250)
            return {...state, ...action.payload}
        case type.GET_SINGLE_CONVERSATION:
            setTimeout(()=>{action.data.func(action.payload.conversation.messages)},250)
            return {...state, ...action.payload}

        default:
            return state
    }
  }

export { initialState, reducer }
