'use client'

import { useEffect, useState, useTransition, useMemo } from "react";
import { useAccount, useContractRead } from "wagmi";
import { getAllNfts } from "@/app/services/actions/getNfts";
import Table from "@/app/Components/Table/table";
import TableNoNft from "@/app/Components/Table/tableNoNft";
import Spinner from "../Spinner/Spinner";
import abi from "src/app/abi.json";
import { getAllNftDataFromContract } from "../../services/actions/getAllNfts";
import { getNftFlingDataFromContractApi } from "../../services/actions/getFlingNft";
import NftFlingComponent from "../Table/NftComponent/NftFling";
import NftModel from "../utils/Models/NftModel";
import NftFlingModel from "../utils/Models/NftFlingModel";
import { getMamboNameApi } from "@/app/services/actions/getMamboName";
import Modal from "../Modal/Modal";
import RulesButton from "../utils/rules/RulesButton";


export default function NftPage() {
    // Get the user address
    const userAddress = useAccount().address as string;
    const [isPendingNftDataFromContract, startTransitionNftDataFromContract] = useTransition();
    const [isPendingFling, startTransitionFling] = useTransition();
    const [isPendingNftData, startTransitionNftData] = useTransition();
    const [nftData, setNftData] = useState<NftModel[]>([]);
    const [nftIdFromContract, setNftIdFromContract] = useState<String[]>([]);
    const [nftDataFromContract, setNftDataFromContract] = useState<NftModel[]>([]);
    const [nftDataFling, setNftDataFling] = useState<NftFlingModel>();   


    const [error, setError] = useState<any>(null);

    const {data: id, isSuccess: isSuccessNftStaked} = 
        useContractRead({ 
            abi,
            address: process.env.NEXT_PUBLIC_HUMPING_STACKING_CONTRACT,
            functionName: 'getStakedIdsFromOwner',
            args: [
                userAddress
            ],
        });

    const {data: flingData, isSuccess} = 
    useContractRead({ 
        abi,
        address: process.env.NEXT_PUBLIC_HUMPING_STACKING_CONTRACT,
        functionName: 'lastFling',
    });

    useEffect(() => {  
        if(isSuccess){
            const intIds = parseInt(flingData[0].toString()); // ou Number(bigInt) pour une conversion explicite
            getNftFlingDataFromContract(flingData, intIds);
        } 
    }, [flingData, isSuccess]);

    useEffect(() => {  
        if(isSuccessNftStaked){
            if(id != undefined || id.length>0){
                const intIds = id.map((bigInt:BigInt) => parseInt(bigInt.toString())); // ou Number(bigInt) pour une conversion explicite
                setNftIdFromContract(intIds);
            }
        } 
    }, [id, isSuccessNftStaked]);

     // Call the function to get the NFTs
     useEffect(() => {
        getNftDataFromContract(nftIdFromContract);  
        getNftData();
    }, [nftIdFromContract]);

         // This function will be called to get the NFTs for the user
    async function getNftFlingDataFromContract(flingData:any, nftIdFromContract:any) { 
        try {
            startTransitionFling(async () => {
                const result = await getNftFlingDataFromContractApi(nftIdFromContract);
                if(result){
                    //Get mamboName (null if not exist)
                    const mamboName = await getMamboNameApi(flingData[3]);                    
                        const instance:NftFlingModel = new NftFlingModel(result.id, result.metadata.image, result.tokenId, result.metadata.attributes.find(attribute => attribute.traitType === "Favourite Position").value, flingData[3], flingData[4], mamboName);
                        await setNftDataFling(instance);
                }
            }
            
       )} catch (err: any) {
           setError(err);
       }        
   }

    // This function will be called to get the NFTs for the user
    async function getNftData() {
        try {
            startTransitionNftData(async () => {
                const result = await getAllNfts(userAddress as string);
                const res: NftModel[] = [];
                if(result){
                    for(let i=0; i<result.length;i++){
                        const instance = new NftModel(result[i].id, result[i].metadata.image, result[i].tokenId, result[i].metadata.attributes.find(attribute => attribute.traitType === "Favourite Position").value);
                        res.push(instance);
                    }
                }
                await setNftData(res); 
            });
        } catch (err: any) {
            setError(err);
        }
    }
    
    // This function will be called to get the NFTs for the user
    async function getNftDataFromContract(nftIdFromContract:any) { 
        try {
            startTransitionNftDataFromContract(async () => {
                const result = await getAllNftDataFromContract(nftIdFromContract);
                const res: NftModel[] = [];
                if(result){
                    for(let i=0; i<result.length;i++){
                        const instance = new NftModel(result[i].id, result[i].metadata.image, result[i].tokenId, result[i].metadata.attributes.find(attribute => attribute.traitType === "Favourite Position").value);
                        res.push(instance);
                    }
                }
                await setNftDataFromContract(res);
            });
       } catch (err: any) {
           setError(err);
       }        
   }



    
    const TableComponent = useMemo(() => {
        if(isPendingFling && isPendingNftData && isPendingNftDataFromContract){
            if (nftData !==[] || nftDataFromContract!==[]) {
                return <div>
                            <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
                                <div className='flex justify-center place-content-start md:col-start-2 md:col-end-5'>
                                    <Table nftData={nftData} stakedNftDataFromOwner={nftDataFromContract} isSuccessNftStaked={isSuccessNftStaked} isSuccess={isSuccess}/>
                                </div>
                                <div className='flex flex-col gap-2 justify-center place-items-center md:col-start-5 md:col-end-7'>
                                    <div className='flex justify-center place-content-center w-8/12 rounded-3xl border-4 bg-[#6f84ef57]'>
                                        <div className='flex-col w-full '>
                                            <span className='flex justify-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-text text-4xl my-6'>LAST FLING</span>
                                            <NftFlingComponent userAddress={userAddress} key={nftDataFling?.id} id={nftDataFling?.id} image={nftDataFling?.dataImage} favPosition={nftDataFling?.favPosition} flingWinner={nftDataFling?.flingWinner} isClaimed={nftDataFling?.isClaimed} mamboName={nftDataFling?.mamboName[0]} />
                                        </div> 
                                        
                                    </div>
                                    <RulesButton />
                                                                              
                                </div>
                            </div>
                            
                        </div>
            } else {
                return <TableNoNft />;
            }
        }else{
            return <div className="flex justify-center">
                <Spinner />
                </div>
        }
        
    }, [nftData, nftDataFromContract, nftDataFling]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            {TableComponent}
        </>
    )
}

