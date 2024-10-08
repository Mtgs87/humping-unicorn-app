import React, { useEffect, useState } from 'react';

interface NftComponentProps {
    key: string; // Ou tout autre type approprié pour la clé
    id: string;
    profileNft: string; // Ou tout autre type approprié pour l'image
    nftTokenId: string; // Ou tout autre type approprié pour l'ID du token NFT
    favPosition: any; // Le type de cette propriété dépend de votre application
    handleAddTokenIdToList: (tokenId: string) => void; // Le type de cette fonction dépend de votre application
    handleRemoveTokenIdToList: (tokenId: string) => void; // Le type de cette fonction dépend de votre application
    isChange: boolean; // Ou tout autre type approprié pour l'état de changement
}

export default function NftComponent({ id, profileNft, nftTokenId, favPosition, handleAddTokenIdToList, handleRemoveTokenIdToList, isChange }: NftComponentProps){
    const [isSelected, setIsSelected] = useState<boolean>(false);

    useEffect(() => {
        setIsSelected(false);
    }, [isChange]);

    function handleIsSelected(event:any){
        setIsSelected(!isSelected);
        if(!isSelected){
            handleAddTokenIdToList(nftTokenId);            
        }else{
            handleRemoveTokenIdToList(nftTokenId);
        }
    }

    return(
        <button onClick={event => handleIsSelected(event)} >
            {
            !isSelected ?
            <div className={` w-full h-full `}>
                <div className='w-full h-full overflow-hidden bg-[#6e7cc4b1] border-2 border-white'>
                    <div className=' w-full  h-full flex flex-col justify-start items-center '>
                
                    <img alt="nftImg" src={profileNft} className="w-full h-auto"/>
                    <hr className='w-full bg-white'></hr>
                    <div className='mt-4 mb-4 w-full'>
                        <span className='w-full text-black bg-pink-300 rounded-xl text-center font-body lg:text-xs sm:text-xs md:text-xxs p-1  shadow-xl shadow-pink-800/50'>{favPosition}</span>
                    </div>
                    </div>
                </div>               
            </div> 
            :
            <div className={` w-full h-full opacity-70`}>
                <div className='w-full h-full overflow-hidden bg-[#6e7cc4b1] border-2 border-white'>
                    <div className=' w-full  h-full flex flex-col justify-start items-center '>
                
                    <img alt="nftImg" src={profileNft} className="w-full h-auto"/>
                    <hr className='w-full bg-white'></hr>
                    <div className='mt-4 mb-4 w-full'>
                        <span className='w-full bg-pink-300 text-black rounded-xl text-center font-body md:text-xxs lg:text-xs sm:text-xs p-1  shadow-xl shadow-pink-800/50'>{favPosition}</span>
                    </div>
                    </div>
                </div>               
            </div> 
            }
             
           
              
        </button>
        
    );
}