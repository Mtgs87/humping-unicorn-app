import React, { useContext, useState, useEffect, startTransition } from 'react';
import { useAccount, useContractRead, useWriteContract } from "wagmi";
import abi from "src/app/abi.json";
import Spinner from '../../Spinner/Spinner';
import Link from "next/link";
import { BasicModal } from "../../../Components/Modal/Modal";

type NftFling = {
    userAddress: string,
    id:number,
    image:string,
    favPosition: string,
    flingWinner: string,
    isClaimed: boolean,
    mamboName: string
}

export default function NftFlingComponent({ userAddress, id, image, favPosition, flingWinner, isClaimed, mamboName } : NftFling){
    
    const { writeContract } = useWriteContract();
    const [error, setError] = useState<any>(null);
            
        async function claimNft(e: any){
            e.preventDefault();
            try {
                // Appel de la fonction du contrat
                await writeContract({ 
                    abi,
                    address: process.env.NEXT_PUBLIC_HUMPING_STACKING_CONTRACT,
                    functionName: 'claimSwinger',
                });
            } catch (error) {
                console.error('Erreur lors de l\'appel de la fonction unstakeMany :', error);
            } 
        }   

    return(
        <div className={`w-3/4 mx-auto`}>
            <div className='w-full h-full overflow-hidden bg-[#6e7cc4b1] border-2 border-white'>
                    {image ?
                   
                        <div className='w-full  h-full flex flex-col justify-center items-center '>
                            <img alt="nftImg" src={image} className="w-full h-auto"/>
                            <hr className='w-full bg-white'></hr>
                            <div className='p-4'>
                                <span className='text-black bg-pink-300 rounded-xl text-center font-body font-text text-xs lg:text-sm xl:text-xs px-2 py-1 shadow-xl shadow-pink-800/50'>{favPosition}</span>
                            </div>
                        </div>                    
                    
                    :
                    <div className='flex justify-center'>                    
                        <Spinner></Spinner>
                    </div>
                    }
                    
            </div>
            <div className='flex justify-center mt-6'>
            {
            flingWinner === userAddress ?
                isClaimed===false ?
                    <div className='flex justify-center mt-6'>
                        <p>You're bringing home a friend !</p>
                        <button className='bg-[#414A78] p-2 border-2 border-solid border-white text-xl rounded-2xl hover:bg-pink-300 shadow-2xl shadow-white mb-4'
                        type="button"
                        onClick={(e)=>claimNft(e)}>
                        CLAIM !
                    </button>
                    </div>
                    
                :
                    <button className='bg-[#414A78] p-2 border-2 border-solid border-white text-xl rounded-2xl hover:bg-pink-300 shadow-2xl shadow-white mb-4'
                     type="button"
                     disabled
                     style={{cursor: "not-allowed"}}>
                     Already Claimed !
                    </button>
            :
                    mamboName ?
                        <p className='font-body font-black italic'>Going home with : <span>{mamboName}</span></p>
                    :
                        flingWinner ?
                            <p className='font-body font-black italic'>Going home with : <span>{flingWinner.slice(0, 3)} ... {flingWinner.slice(flingWinner.length-3, flingWinner.length)}</span></p>
                        :
                            <div></div>
            }
            </div>                
        </div> 
    );
}