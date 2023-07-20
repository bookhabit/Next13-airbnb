import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback,useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";

import useLoginModal from "./useLoginModal";

interface IUseFavorite {
    listingId:string;
    currentUser?:SafeUser | null;
}

const useFavorite = ({listingId,currentUser}:IUseFavorite)=>{
    const router = useRouter();
    const loginModal = useLoginModal();

    // 이 listingId가 관심목록인지 (포함하고있으면 true)
    const hasFavorited = useMemo(()=>{
        const list = currentUser?.favoriteIds || [];

        return list.includes(listingId)
    },[currentUser,listingId])

    // 관심목록 토글함수 - 관심목록인데 클릭되었으면 삭제 , 관심목록 아닌데 클릭되었으면 관심목록 추가
    const toggleFavorite = useCallback(async (e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation();

        if(!currentUser){
            return loginModal.onOpen();
        }
        try{
            let requrest;

            if(hasFavorited){
                requrest = ()=> axios.delete(`/api/favorites/${listingId}`)
            }else{
                requrest = ()=> axios.post(`/api/favorites/${listingId}`)
            }

            await requrest();
            router.refresh();
            toast.success('Success')
        }catch(error){
            toast.error('Something went wrong')
        }

    },[currentUser,hasFavorited,listingId,loginModal,router])

    return{
        hasFavorited,toggleFavorite
    }
}

export default useFavorite;