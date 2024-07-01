import {userApiSlice} from '../apiSlice' 


const ADMIN_URL = '/api/admin'

export const adminSlice = userApiSlice.injectEndpoints({
    endpoints: (builder) => ({
      Adminlogin: builder.mutation({
        query: (data) => ({
          url: `${ADMIN_URL}/adminAuth`,
          method: 'POST',
          body: data,
        }),
      }),
      AdminLoadDashboard : builder.mutation({
          query : ()=>({
            url : `${ADMIN_URL}/`,
            method : 'GET'
          })
      }),
      AdminGetIndustries : builder.mutation({
        query : ()=>({
          url : `${ADMIN_URL}/getIndustries`,
          method : 'GET'
        })
      }),
      AdminAddIndustries : builder.mutation({
        query : (data)=>({
            url : `${ADMIN_URL}/addIndustry`,
            method : 'POST',
            body : data
        })
      }),
      AdminEditIndustry : builder.mutation({
        query : (data)=>({
          url : `${ADMIN_URL}/editIndustry`,
          method : 'POST',
          body : data
        })
      }),
      AdminGetSkills : builder.mutation({
        query : ()=>({
          url : `${ADMIN_URL}/getSkills`,
          method : 'GET'
        })
      }),
      AdminAddSkill: builder.mutation({
        query : (data)=>({
            url : `${ADMIN_URL}/addSkill`,
            method : 'POST',
            body : data
        })
      }),
      AdminEditSkill: builder.mutation({
        query : (data)=>({
            url : `${ADMIN_URL}/editSkill`,
            method : 'POST',
            body : data
        })
      }),
      AdminListSkill: builder.mutation({
        query : (data)=>({
            url : `${ADMIN_URL}/listSkill`,
            method : 'POST',
            body : data
        })
      }),
      AdminUnlistSkill: builder.mutation({
        query : (data)=>({
            url : `${ADMIN_URL}/unlistSkill`,
            method : 'POST',
            body : data
        })
      }),
      AdminGetRecruiterRequests : builder.mutation({
        query : ()=>({
          url : `${ADMIN_URL}/getRecruiterRequests`,
          method : 'GET'
        })
      }),
      AdminAcceptRecruiter : builder.mutation({
        query : (data)=>({
          url : `${ADMIN_URL}/acceptRecruiter`,
          method : 'POST',
          body : data
        })
      }),
      AdminGetUsers : builder.mutation({
        query : ()=>({
          url : `${ADMIN_URL}/getUsers`,
          method : 'GET'
        })
      }),
      AdminBlockUser : builder.mutation({
        query : (data)=>({
          url : `${ADMIN_URL}/blockUser`,
          method : 'POST',
          body : data
        })
      }),
      AdminUnblockUser : builder.mutation({
        query : (data)=>({
          url : `${ADMIN_URL}/unblockUser`,
          method : 'POST',
          body : data
        })
      }),
      adminGetJobRequests : builder.mutation({
        query : ()=>({
          url : `${ADMIN_URL}/getJobRequests`,
          method : 'GET'
        })
      }),
      adminAcceptJob : builder.mutation({
        query : (data)=>({
          url : `${ADMIN_URL}/acceptJob`,
          method : 'POST',
          body : data
        })
      }),
      AdminGetRecruiters : builder.mutation({
        query : ()=>({
          url : `${ADMIN_URL}/getRecruiters`,
          method : 'GET'
        })
      }),
      AdminBlockRecruiter : builder.mutation({
        query : (data)=>({
          url : `${ADMIN_URL}/blockRecruiter`,
          method : 'POST',
          body : data
        })
      }),
      AdminUnblockRecruiter : builder.mutation({
        query : (data)=>({
          url : `${ADMIN_URL}/unblockRecruiter`,
          method : 'POST',
          body : data
        })
      }),
      Adminlogout: builder.mutation({
        query: () => ({
          url: `${ADMIN_URL}/logout`,
          method: 'GET',
        }),
      }),
    }),
  })

export const {
    useAdminloginMutation,
    useAdminlogoutMutation,
    useAdminLoadDashboardMutation,
    useAdminGetIndustriesMutation,
    useAdminAddIndustriesMutation,
    useAdminEditIndustryMutation,
    useAdminAddSkillMutation,
    useAdminEditSkillMutation,
    useAdminListSkillMutation,
    useAdminUnlistSkillMutation,
    useAdminGetSkillsMutation,
    useAdminGetRecruiterRequestsMutation,
    useAdminAcceptRecruiterMutation,
    useAdminGetUsersMutation,
    useAdminBlockUserMutation,
    useAdminUnblockUserMutation,
    useAdminGetJobRequestsMutation,
    useAdminBlockRecruiterMutation,
    useAdminGetRecruitersMutation,
    useAdminUnblockRecruiterMutation,
    useAdminAcceptJobMutation
} = adminSlice