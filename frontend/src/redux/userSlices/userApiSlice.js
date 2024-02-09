import { userApiSlice } from "../apiSlice"

const USERS_URL = '/api/users'

export const userSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    Verifyregisteration: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verifyRegistration`,
        method: 'POST',
        body: data,
      }),
    }),
    addJobPreference: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/addJobPreference`,
        method: 'POST',
        body: data
      })
    }),
    getIndustryTypes: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/getIndustries`,
        method: 'GET'
      })
    }),
    addSkills: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/addSkills`,
        method: 'POST',
        body: data
      })
    }),
    getSkills: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/getSkills`,
        method: 'GET'
      })
    }),
    getProfile: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/myProfile`,
        method: 'GET',
        params
      })
    }),
    editProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/editProfile`,
        method: 'POST',
        body: data
      })
    }),
    getMyPosts: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/myPosts`,
        method: 'GET',
      })
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createPost`,
        method: 'POST',
        body: data
      })
    }),
    editPost: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/editPost`,
        method: 'PUT',
        params
      })
    }),
    likePost: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/likePost`,
        method: 'PUT',
        params
      })
    }),
    postComment: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/addComment`,
        method: 'POST',
        body: data
      })
    }),
    deleteComment: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/deleteComment`,
        method: 'GET',
        params
      })
    }),
    deletePost: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/deletePost`,
        method: 'GET',
        params
      })
    }),
    jobPreferenceAndSkills: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/jobPreferencePage`,
        method: 'GET',
        params
      })
    }),
    deleteSkill: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/removeSkill`,
        method: 'PUT',
        params
      })
    }),
    listJobs: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/listJobs`,
        method: 'GET'
      })
    }),
    saveJobs: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/saveJob`,
        method: 'PUT',
        params
      })
    }),
    unsaveJobs: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/unSaveJob`,
        method: 'PUT',
        params
      })
    }),
    UserViewJob: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/viewJob`,
        method: 'GET',
        params
      })
    }),
    userSearchJob: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/searchJob`,
        method: 'GET',
        params
      })
    }),
    applyJob: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/applyJob`,
        method: 'POST',
        body: data
      })
    }),
    listSavedJobs: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/savedJobs`,
        method: 'GET'
      })
    }),
    userChangePassword: builder.mutation({
      query: (params) => ({
        url: `${USERS_URL}/changePassword`,
        method: 'PUT',
        params
      })
    }),
    userlistJobStatus: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/getJobStatus`,
        method: 'GET'
      })
    }),
    userlistPosts : builder.mutation({
      query : ()=>({
        url : `${USERS_URL}/listPosts`,
        method : 'GET'
      })
    }),
    userSavePost : builder.mutation({
      query : (params)=>({
        url : `${USERS_URL}/savepost`,
        method : 'PUT',
        params
      })
    }),
    userUnsavePost : builder.mutation({
      query : (params)=>({
        url : `${USERS_URL}/unSavepost`,
        method : 'PUT',
        params
      })
    }),
    userlistSavedPosts : builder.mutation({
      query : ()=>({
        url : `${USERS_URL}/SavedPosts`,
        method : 'GET'
      })
    }),
    userlistMyNetwork : builder.mutation({
      query : (params)=>({
        url : `${USERS_URL}/MyNetwork`,
        method : 'GET',
        params
      })
    }),
    userConnect : builder.mutation({
      query : (params)=>({
        url : `${USERS_URL}/connect`,
        method : 'PUT',
        params
      })
    }),
    userLogout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyregisterationMutation,
  useAddJobPreferenceMutation,
  useGetIndustryTypesMutation,
  useAddSkillsMutation,
  useGetSkillsMutation,
  useGetProfileMutation,
  useEditProfileMutation,
  useGetMyPostsMutation,
  useCreatePostMutation,
  useEditPostMutation,
  useLikePostMutation,
  usePostCommentMutation,
  useDeleteCommentMutation,
  useDeletePostMutation,
  useJobPreferenceAndSkillsMutation,
  useDeleteSkillMutation,
  useListJobsMutation,
  useSaveJobsMutation,
  useUnsaveJobsMutation,
  useUserViewJobMutation,
  useUserSearchJobMutation,
  useApplyJobMutation,
  useListSavedJobsMutation,
  useUserChangePasswordMutation,
  useUserlistJobStatusMutation,
  useUserlistPostsMutation,
  useUserSavePostMutation,
  useUserUnsavePostMutation,
  useUserlistSavedPostsMutation,
  useUserlistMyNetworkMutation,
  useUserConnectMutation,
  useUserLogoutMutation
} = userSlice