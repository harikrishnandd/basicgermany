import { revalidatePath } from 'next/cache';

export async function POST(request) {
    try {
        const { slug } = await request.json();

        // Revalidate the specific article page
        revalidatePath(`/knowledge/${slug}`);

        return Response.json({
            revalidated: true,
            slug: slug,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        return Response.json({
            error: 'Error revalidating',
            message: err.message
        }, { status: 500 });
    }
}
