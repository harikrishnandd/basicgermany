import { revalidatePath } from 'next/cache';

export async function POST(request) {
    try {
        const { slug } = await request.json();

        // Revalidate the specific article page
        revalidatePath(`/knowledge/${slug}`);
        
        // Also revalidate the knowledge listing pages to show updated articles
        revalidatePath('/knowledge');
        revalidatePath('/knowledge/all');

        return Response.json({
            revalidated: true,
            slug: slug,
            paths: [`/knowledge/${slug}`, '/knowledge', '/knowledge/all'],
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        return Response.json({
            error: 'Error revalidating',
            message: err.message
        }, { status: 500 });
    }
}
