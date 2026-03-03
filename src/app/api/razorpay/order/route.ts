import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: Request) {
    // Lazy initialization to avoid build-time errors when ENV variables are missing
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials missing')
        return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 })
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    try {
        const { amount, planId } = await request.json()

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                planId: planId
            }
        }

        const order = await razorpay.orders.create(options)
        return NextResponse.json(order)
    } catch (error) {
        console.error('Razorpay Order Error:', error)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
}
