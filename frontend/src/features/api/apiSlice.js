import {
  GetInfoRequest,
  GetInfoResponse,
  WalletBalanceRequest,
  WalletBalanceResponse,
  GetTransactionsRequest,
  TransactionDetails,
  ListPeersRequest,
  ListPeersResponse,
  ListChannelsRequest,
  ListChannelsResponse,
  PendingChannelsRequest,
  PendingChannelsResponse,
  ConnectPeerRequest,
  ConnectPeerResponse,
  LightningAddress,
  DisconnectPeerRequest,
  DisconnectPeerResponse,
  OpenChannelRequest,
  CloseChannelRequest,
  CloseStatusUpdate,
  ChannelPoint,
  NewAddressRequest,
  NewAddressResponse,
  SendCoinsRequest,
  SendCoinsResponse,
} from '../../proto/lnd_pb';
import {
  GetSqueakProfileRequest,
  GetSqueakProfileReply,
  GetTimelineSqueakDisplaysRequest,
  GetTimelineSqueakDisplaysReply,
  SetSqueakProfileFollowingRequest,
  SetSqueakProfileFollowingReply,
  GetPeersRequest,
  PayOfferRequest,
  GetBuyOffersRequest,
  GetBuyOfferRequest,
  GetPeerRequest,
  SetPeerAutoconnectRequest,
  GetSigningProfilesRequest,
  GetProfilesRequest,
  GetContactProfilesRequest,
  MakeSqueakRequest,
  GetSqueakDisplayRequest,
  GetAncestorSqueakDisplaysRequest,
  GetReplySqueakDisplaysRequest,
  GetSqueakProfileByPubKeyRequest,
  GetPubKeySqueakDisplaysRequest,
  CreateContactProfileRequest,
  CreateSigningProfileRequest,
  ImportSigningProfileRequest,
  CreatePeerRequest,
  DeletePeerRequest,
  DeleteSqueakProfileRequest,
  DeleteSqueakRequest,
  DownloadSqueakRequest,
  GetSentPaymentsRequest,
  GetReceivedPaymentsRequest,
  GetNetworkRequest,
  GetSqueakProfilePrivateKeyRequest,
  GetPaymentSummaryRequest,
  RenameSqueakProfileRequest,
  RenameSqueakProfileReply,
  SetSqueakProfileImageRequest,
  ClearSqueakProfileImageRequest,
  ReprocessReceivedPaymentsRequest,
  LikeSqueakRequest,
  UnlikeSqueakRequest,
  GetLikedSqueakDisplaysRequest,
  GetConnectedPeersRequest,
  GetConnectedPeerRequest,
  ConnectPeerRequest as ConnectSqueakPeerRequest,
  DisconnectPeerRequest as DisconnectSqueakPeerRequest,
  DownloadOffersRequest,
  DownloadRepliesRequest,
  DownloadPubKeySqueaksRequest,
  PeerAddress,
  SetSqueakProfileImageReply,
  ClearSqueakProfileImageReply,
  GetPeersReply,
  PayOfferReply,
  GetBuyOffersReply,
  GetBuyOfferReply,
  GetPeerReply,
  SetPeerAutoconnectReply,
  GetProfilesReply,
  GetSigningProfilesReply,
  GetContactProfilesReply,
  MakeSqueakReply,
  GetSqueakDisplayReply,
  GetAncestorSqueakDisplaysReply,
  GetReplySqueakDisplaysReply,
  GetPubKeySqueakDisplaysReply,
  GetSqueakProfileByPubKeyReply,
  CreateContactProfileReply,
  CreateSigningProfileReply,
  ImportSigningProfileReply,
  CreatePeerReply,
  DeletePeerReply,
  DeleteSqueakProfileReply,
  DeleteSqueakReply,
  DownloadSqueakReply,
  DownloadOffersReply,
  DownloadRepliesReply,
  DownloadPubKeySqueaksReply,
  GetSentPaymentsReply,
  GetReceivedPaymentsReply,
  GetNetworkReply,
  GetSqueakProfilePrivateKeyReply,
  GetPaymentSummaryReply,
  ReprocessReceivedPaymentsReply,
  LikeSqueakReply,
  UnlikeSqueakReply,
  GetLikedSqueakDisplaysReply,
  GetConnectedPeersReply,
  GetConnectedPeerReply,
  ConnectPeerReply as ConnectSqueakPeerReply,
  DisconnectPeerReply as DisconnectSqueakPeerReply,
  GetExternalAddressRequest,
  GetExternalAddressReply,
  GetSearchSqueakDisplaysRequest,
  GetSearchSqueakDisplaysReply,
  GetPeerByAddressRequest,
  GetPeerByAddressReply,
  GetDefaultPeerPortRequest,
  GetDefaultPeerPortReply,
  GetTwitterAccountsRequest,
  GetTwitterAccountsReply,
  AddTwitterAccountRequest,
  AddTwitterAccountReply,
  DeleteTwitterAccountRequest,
  DeleteTwitterAccountReply,
  SetPeerShareForFreeRequest,
  SetPeerShareForFreeReply,
  SetSellPriceRequest,
  SetSellPriceReply,
  GetSellPriceRequest,
  GetSellPriceReply,
  ClearSellPriceRequest,
  ClearSellPriceReply,
  GetTwitterStreamStatusRequest,
  GetTwitterStreamStatusReply,
  DecryptSqueakRequest,
  DecryptSqueakReply,
} from '../../proto/squeak_admin_pb';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => {
        console.log('Calling get posts');
        return '/posts';
      },
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map(({ id }) => ({ type: 'Post', id })),
      ],
    }),
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find((post) => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})


console.log('The value of REACT_APP_DEV_MODE_ENABLED is:', Boolean(process.env.REACT_APP_DEV_MODE_ENABLED));
const DEV_MODE_ENABLED = process.env.REACT_APP_DEV_MODE_ENABLED;

console.log('The value of REACT_APP_SERVER_PORT is:', process.env.REACT_APP_SERVER_PORT);
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || window.location.port;

export const web_host_port = `${window.location.protocol}//${window.location.hostname}:${SERVER_PORT}`;


/**
 * Copied from here:
 * https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
 */
function makeRequest(route, request, deserializeMsg, handleResponse, handleError) {
  fetch(`${web_host_port}/${route}`, {
    method: 'post',
    body: request.serializeBinary(),
  })
    .then((response) => {
      if (!response.ok) { throw response; }
      return response.arrayBuffer(); // we only get here if there is no error
    })
    .then((buffer) => {
      handleResponse(deserializeMsg(buffer));
    })
    .catch((err) => {
      if (!handleError) {
        return;
      }
      if (err.text) {
        err.text().then((errorMessage) => {
          handleError(errorMessage);
        });
      } else {
        handleError('Error.'); // Hardcoded error here
      }
    });
}

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, deser }) => {
    try {
      const result = await axios({ url: baseUrl + url, responseType: 'arraybuffer', method, data })
      console.log(result);
      console.log(result.data);
      console.log(typeof(result.data));
      console.log(deser);
      console.log(deser(result.data));
      return { data: deser(result.data) }
    } catch (axiosError) {
      let err = axiosError
      return {
        error: { status: err.response?.status, data: err.response?.data },
      }
    }
  }


export const squeakApiSlice = createApi({
  reducerPath: 'squeakApi',
  baseQuery: axiosBaseQuery({
    baseUrl: web_host_port,
  }),
  endpoints(build) {
    return {
      getTimelineSqueaks: build.query({
        query: () => {
          console.log('Calling getTimelineSqueaks');
          const request = new GetTimelineSqueakDisplaysRequest();
          request.setLimit(10);
          const body = request.serializeBinary();
          const deser = GetTimelineSqueakDisplaysReply.deserializeBinary;

          return ({ url: '/gettimelinesqueakdisplays', method: 'post', data: body, deser: deser })
      } }),
    }
  },
})


export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice


export const {
  useGetTimelineSqueaksQuery,
} = squeakApiSlice
