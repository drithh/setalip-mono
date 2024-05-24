import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: 'No files received.' },
        { status: 400 },
      );
    }

    const host = req.headers.get('host') || 'localhost:3000'; // Default host
    const protocol = req.headers.get('x-forwarded-proto') || 'http';

    const fileInfos = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${file.name.replaceAll(' ', '_').toLowerCase()}`;
        const fullPath = path.join(
          process.cwd(),
          'public',
          'uploads',
          filename,
        );
        await writeFile(fullPath, buffer);

        return {
          url: `${protocol}://${host}/uploads/${filename}`,
          name: file.name,
        };
      }),
    );

    return NextResponse.json(fileInfos, { status: 201 });
  } catch (error) {
    console.log('Error occurred', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the files.' },
      { status: 500 },
    );
  }
};
