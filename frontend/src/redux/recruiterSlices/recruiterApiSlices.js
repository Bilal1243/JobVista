import { userApiSlice } from '../apiSlice'


const RECRUITER_URL = '/api/recruiter'

export const recruiterSlice = userApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        recruiterLogin: builder.mutation({
            query: (data) => ({
                url: `${RECRUITER_URL}/recruiterAuth`,
                method: 'POST',
                body: data,
            }),
        }),
        recruiterRegister: builder.mutation({
            query: (data) => ({
                url: `${RECRUITER_URL}/sendOtp`,
                method: 'POST',
                body: data,
            }),
        }),
        recruiterVerifyregisteration: builder.mutation({
            query: (data) => ({
                url: `${RECRUITER_URL}/verifyRecruiter`,
                method: 'POST',
                body: data,
            }),
        }),
        recruiterGetIndustryTypes: builder.mutation({
            query: () => ({
                url: `${RECRUITER_URL}/getIndustries`,
                method: 'GET'
            })
        }),
        recruiterGetSkills: builder.mutation({
            query: () => ({
                url: `${RECRUITER_URL}/listSkills`,
                method: 'GET'
            })
        }),
        recruiterPostJob : builder.mutation({
            query : (data)=>({
                url : `${RECRUITER_URL}/postJob`,
                method : 'POST',
                body : data
            })
        }),
        recruiterListJobs : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/getMyjobs`,
                method : 'Get',
                params
            })
        }),
        recruiterSearchJob : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/searchJob`,
                method : 'Get',
                params
            })
        }),
        recruiterFilterLocation : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/filterByLocation`,
                method : 'Get',
                params
            })
        }),
        recruiterViewJobDetails : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/viewJobDetails`,
                method : 'Get',
                params
            })
        }),
        recruiterChangeStatus : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/changeStatus`,
                method : 'PUT',
                params
            })
        }),
        recruitergetResume : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/loadResume`,
                method : 'GET',
                params
            })
        }),
        recruiterLogout: builder.mutation({
            query: () => ({
                url: `${RECRUITER_URL}/logout`,
                method: 'GET',
            }),
        }),
        recruiterMyProfile : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/loadMyProfile`,
                method : 'GET',
                params
            })
        }),
        recruitereditProfile : builder.mutation({
            query : (data)=>({
                url : `${RECRUITER_URL}/recruiterEditProfile`,
                method : 'POST',
                body : data
            })   
        }),
        recruiterCreatePost : builder.mutation({
            query : (data)=>({
                url : `${RECRUITER_URL}/createPost`,
                method : 'POST',
                body : data
            })   
        }),
        recruiterGetPosts : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/getMyPosts`,
                method : 'GET',
                params
            })   
        }),
        recruiterLikePost : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/likePost`,
                method : 'PUT',
                params
            })   
        }),
        recruiterAddComment : builder.mutation({
            query : (data)=>({
                url : `${RECRUITER_URL}/addComment`,
                method : 'POST',
                body : data
            })   
        }),
        recruiterDeleteComment : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/deleteComment`,
                method : 'GET',
                params
            })   
        }),
        recruiterDeletePost : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/deletePost`,
                method : 'GET',
                params
            })   
        }),
        recruiterEditPost : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/editPost`,
                method : 'PUT',
                params
            })   
        }),
        recruiterListPosts : builder.mutation({
            query : ()=>({
                url : `${RECRUITER_URL}/recruiterListPosts`,
                method : 'GET'
            })   
        }),
        recruitersavePost : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/recruiterSavePost`,
                method : 'PUT',
                params
            })   
        }),
        recruiterunSavePost : builder.mutation({
            query : (params)=>({
                url : `${RECRUITER_URL}/recruiterUnSavePost`,
                method : 'PUT',
                params
            })   
        }),
        recruiterListSavedPosts : builder.mutation({
            query : ()=>({
                url : `${RECRUITER_URL}/recruiterSavedPosts`,
                method : 'GET',
            })   
        }),
    }),
})

export const {
    useRecruiterLoginMutation,
    useRecruiterRegisterMutation,
    useRecruiterVerifyregisterationMutation,
    useRecruiterGetIndustryTypesMutation,
    useRecruiterGetSkillsMutation,
    useRecruiterPostJobMutation,
    useRecruiterListJobsMutation,
    useRecruiterSearchJobMutation,
    useRecruiterFilterLocationMutation,
    useRecruiterViewJobDetailsMutation,
    useRecruiterChangeStatusMutation,
    useRecruitergetResumeMutation,
    useRecruiterMyProfileMutation,
    useRecruitereditProfileMutation,
    useRecruiterCreatePostMutation,
    useRecruiterGetPostsMutation,
    useRecruiterAddCommentMutation,
    useRecruiterDeleteCommentMutation,
    useRecruiterDeletePostMutation,
    useRecruiterEditPostMutation,
    useRecruiterLikePostMutation,
    useRecruiterListPostsMutation,
    useRecruiterListSavedPostsMutation,
    useRecruitersavePostMutation,
    useRecruiterunSavePostMutation,
    useRecruiterLogoutMutation
} = recruiterSlice