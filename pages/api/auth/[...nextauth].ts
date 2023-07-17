import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"

import prisma from "@/app/libs/prismadb"
import NextAuth from "next-auth/next";

export const authOptions:AuthOptions = {
    adapter:PrismaAdapter(prisma),
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name:"credentials",
            credentials:{
                email:{label:'email',type:'text'},
                password:{label:"password",type:'password'}
            },
            async authorize(credentials){
                // credentials를 사용하여 사용자 인증을 처리하는 함수를 정의합니다.
                if(!credentials?.email||!credentials?.password){
                    throw new Error('Invalid credentials');
                }
                const user = await prisma.user.findUnique({
                    where:{
                        email:credentials.email
                    }
                })

                if(!user || !user?.hashedPassword){
                    throw new Error('Invalid credentials');
                }

                const isCorrectPassword = await bcrypt.compare(credentials.password,user.hashedPassword)

                if(!isCorrectPassword){
                    throw new Error('Invalid credentials');
                }

                return user;

            }
        })
    ],
    // 인증 페이지 설정: pages 객체를 사용하여 인증 페이지를 구성합니다.
    pages:{
        signIn:'/'
    },
    // 디버그 설정: 개발 환경에서 디버그 모드를 활성화합니다.
    debug:process.env.NODE_ENV === "development",
    // 세션 설정: 세션 관리 방식을 JWT(Json Web Token)로 설정합니다.
    session:{
        strategy:'jwt'
    },
    // 시크릿 키 설정: NextAuth.js에서 사용할 시크릿 키를 설정합니다
    secret:process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions);