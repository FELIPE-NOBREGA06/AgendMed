import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string
})

export const POST = async (request: Request) => {
  try {
    console.log('🔄 Iniciando upload no servidor...');
    
    const formData = await request.formData()
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    console.log('📁 Arquivo recebido:', { 
      name: file?.name, 
      size: file?.size, 
      type: file?.type 
    });
    console.log('👤 User ID:', userId);

    if (!file) {
      console.error('❌ Nenhum arquivo enviado');
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    if (!userId || userId === "") {
      console.error('❌ User ID não fornecido');
      return NextResponse.json({ error: "User ID é obrigatório" }, { status: 401 })
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      console.error('❌ Formato inválido:', file.type);
      return NextResponse.json({ error: "Formato de imagem inválido. Use PNG ou JPEG." }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer)

    console.log('☁️ Enviando para Cloudinary...');

    const results = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        tags: [`${userId}`],
        public_id: `profile_${userId}_${Date.now()}`,
        folder: 'agendmed/profiles',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }, function (error, result) {
        if (error) {
          console.error('❌ Erro no Cloudinary:', error);
          reject(error);
          return;
        }
        console.log('✅ Upload concluído:', result?.secure_url);
        resolve(result)
      }).end(buffer)
    })

    return NextResponse.json(results)

  } catch (error) {
    console.error('❌ Erro geral no upload:', error);
    return NextResponse.json({ 
      error: "Erro interno do servidor" 
    }, { status: 500 })
  }
}