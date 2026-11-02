import {useCallback,useEffect,useMemo,useRef,useState,type SetStateAction} from "react";
import {emptyMemoryState,restoreMemoryState} from "../philosophy/memoryEngine";
import type {MemoryQuestion,MemoryState,PhiloMemoryItem} from "../philosophy/memoryModel";

/** A local practice notebook, never a server grade or reward. */
export function useMemoryStore(key:string,items:readonly PhiloMemoryItem[],questions:readonly MemoryQuestion[]) {
  const initial=useMemo(()=>{
    try{return restoreMemoryState(window.localStorage.getItem(key),items,questions,Date.now());}
    catch{return emptyMemoryState();}
  },[key,items,questions]);
  const [snapshot,setSnapshot]=useState({key,value:initial});
  const [storageError,setStorageError]=useState(false);
  const lastWritten=useRef<{key:string;text:string|null}|null>(null);
  const state=snapshot.key===key?snapshot.value:initial;
  useEffect(()=>{if(snapshot.key!==key)setSnapshot({key,value:initial});},[key,initial,snapshot.key]);
  useEffect(()=>{
    if(snapshot.key!==key)return;
    const text=JSON.stringify(snapshot.value);
    if(lastWritten.current?.key===key&&lastWritten.current.text===text)return;
    try{window.localStorage.setItem(key,text);lastWritten.current={key,text};setStorageError(false);}
    catch{setStorageError(true);}
  },[key,snapshot]);
  useEffect(()=>{
    const listener=(event:StorageEvent)=>{
      if(event.key!==key&&event.key!==null)return;
      lastWritten.current={key,text:event.newValue};
      setSnapshot({key,value:restoreMemoryState(event.newValue,items,questions,Date.now())});
    };
    window.addEventListener("storage",listener);
    return()=>window.removeEventListener("storage",listener);
  },[key,items,questions]);
  const setState=useCallback((update:SetStateAction<MemoryState>)=>setSnapshot(previous=>{
    const value=previous.key===key?previous.value:initial;
    return {key,value:typeof update==="function"?update(value):update};
  }),[key,initial]);
  return {state,setState,storageError};
}
