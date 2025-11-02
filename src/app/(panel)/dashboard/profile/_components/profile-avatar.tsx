"use client"
import Image from 'next/image';
import { ChangeEvent, useState } from 'react'
import semFoto from '../../../../../../public/foto1.png'
import { Loader, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfileAvatar } from '../_actions/update-avatar';
import { useSession } from 'next-auth/react'

interface AvatarProfileProps {
  avatarUrl: string | null;
  userId: string;
}

export function AvatarProfile({ avatarUrl, userId }: AvatarProfileProps) {
  const [previewImage, setPreviewImage] = useState(avatarUrl)
  const [loading, setLoading] = useState(false);

  const { update } = useSession();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      
      try {
        const image = e.target.files[0];
        console.log('📁 Imagem selecionada:', { name: image.name, size: image.size, type: image.type });

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
          toast.error("Formato de imagem inválido. Use PNG ou JPEG.");
          return;
        }

        // Verificar tamanho (máximo 5MB)
        if (image.size > 5 * 1024 * 1024) {
          toast.error("Imagem muito grande. Máximo 5MB.");
          return;
        }

        const newFilename = `profile_${userId}`;
        const newFile = new File([image], newFilename, { type: image.type })

        const urlImage = await uploadImage(newFile)

        if (!urlImage || urlImage === "") {
          toast.error("Falha ao alterar imagem");
          return;
        }

        console.log('✅ URL da imagem recebida:', urlImage);
        setPreviewImage(urlImage);

        console.log('💾 Salvando no banco de dados...');
        await updateProfileAvatar({ avatarUrl: urlImage })
        
        console.log('🔄 Atualizando sessão...');
        await update({
          image: urlImage
        })

        toast.success("Imagem de perfil atualizada!");

      } catch (error) {
        console.error('❌ Erro no handleChange:', error);
        toast.error("Erro ao processar imagem");
      } finally {
        setLoading(false);
        // Limpar o input para permitir selecionar a mesma imagem novamente
        e.target.value = '';
      }
    }
  }

  async function uploadImage(image: File): Promise<string | null> {
    try {
      console.log('🔄 Iniciando upload da imagem...');
      toast("Estamos enviando sua imagem...")

      const formData = new FormData();
      formData.append("file", image)
      formData.append("userId", userId)

      console.log('📤 Enviando para:', `${process.env.NEXT_PUBLIC_URL}/api/image/upload`);
      console.log('📁 Arquivo:', { name: image.name, size: image.size, type: image.type });

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/image/upload`, {
        method: "POST",
        body: formData
      })

      console.log('📥 Resposta recebida:', response.status, response.statusText);

      const data = await response.json();
      console.log('📊 Dados da resposta:', data);

      if (!response.ok) {
        console.error('❌ Erro na resposta:', data);
        toast.error(data.error || "Erro ao fazer upload da imagem");
        return null;
      }

      toast.success("Imagem alterada com sucesso!")
      return data.secure_url as string

    } catch (err) {
      console.error('❌ Erro no upload:', err);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    }
  }

  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48">
      <div className='relative flex items-center justify-center w-full h-full '>
        <span className='absolute cursor-pointer z-[2] bg-slate-50/80 p-2 rounded-full shadow-xl'>
          {loading ? <Loader size={16} color="#131313" className='animate-spin' /> : <Upload size={16} color="#131313" />}
        </span>

        <input
          type="file"
          accept="image/png,image/jpeg"
          className='opacity-0 cursor-pointer relative z-50 w-48 h-48'
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      {previewImage ? (
        <Image
          src={previewImage}
          alt="Foto de perfil da clinica"
          fill
          className='w-full h-48 object-cover rounded-full bg-slate-200'
          quality={100}
          priority
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
        />
      ) : (
        <Image
          src={semFoto}
          alt="Foto de perfil da clinica"
          fill
          className='w-full h-48 object-cover rounded-full bg-slate-200'
          quality={100}
          priority
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
        />
      )}
    </div>
  )
}