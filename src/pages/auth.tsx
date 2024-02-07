import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAA } from "state/accountAbstraction/provider/AAProvider";


export default function Auth() {
  const { isConnected, isReady, isRefreshing, web3AuthMPCPack } = useAA();
  const router = useRouter();
  // redirect
  useEffect(() => {
    if (isConnected || isReady || isRefreshing || web3AuthMPCPack) {
      router.push('/');
    }
    setTimeout(() => {
      router.push('/');
    }, 5000);
  });

  return (
    <div>
      <h1>Auth</h1>
      <p>Redirecting...</p>
      <span>If you are not redirected automatically, <Link href="/">Click Here</Link></span>
    </div>
  );

}