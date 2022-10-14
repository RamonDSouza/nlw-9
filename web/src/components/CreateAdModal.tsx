import { Check, GameController } from 'phosphor-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToogleGroup from '@radix-ui/react-toggle-group';

import { Input } from './Form/Input';
import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Game{
  id: string;
  title: string;
  name: string;
  yearsPlaying: Number;
  discord: string;
  weekDays: Number
  hourStart: string;
  hourEnd: string;
  useVoiceChannel: string;
}

export function CreateAdModal() {

  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState(false);

  useEffect(()=>{
    axios('http://localhost:3333/games').then(response =>{
    setGames(response.data);
    })
  },[]);



  async function handleCreatedAd(event: FormEvent ){
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    function showToast(text: string, type: 'error' | 'success' = 'success') {
      toast(text, {
        theme: 'dark',
        type,
        pauseOnHover: true,
      });
    }
  
    if (
      !data.name ||
      !data.yearsPlaying ||
      !data.hourEnd ||
      !data.hourStart ||
      !data.discord ||
      weekDays.length === 0
    ) {
      showToast(
        'Olá viajante! Preencha todas as informções para começar a buscar seu novo duo!',
        'error'
      );
      return;
    }

    try {
     await axios.post(`http://localhost:3333/games/${data.game}/ads`,{
      name: data.name,
      yearsPlaying: Number(data.yearsPlaying),
      discord:data.discord,
      weekDays: weekDays.map(Number),
      hourStart: data.hourStart,
      hourEnd: data.hourEnd,
      useVoiceChannel: useVoiceChannel
     })
     .then(() => {
      showToast("Anunciado com sucesso!!");
        
    });

    } catch (error:any) {
      showToast("Erro ao anunciar");

      
    }
  
  }

  return(
            
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/60 inset-0 fixed' />

        <Dialog.Content className='fixed
         bg-[#2A2634] py-8 px-10
         text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px]
         shadow-lg shadow-black/25'>
          <Dialog.Title className='text-3xl text-white font-black'>Públique um anúncio</Dialog.Title>

         
            <form onSubmit={handleCreatedAd} className='mt-8 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="game" className='font-semibold'>Qual o game?</label>
                <select 
                id="game"
                name="game"
                className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
                defaultValue=""
               >
                  <option disabled value="">Selecione o game que deseja jogar</option>

                  {games.map (game =>{
                    return <option key={game.id} value={game.id}>{game.title}</option>
                  })}
                </select>
               </div>

              <div  className='flex flex-col gap-2'>
                <label htmlFor="game">Seu nome (ou nickname)</label>
                <Input name="name" id="name" placeholder='Como te chamam dentro do game?' />
              </div>

             <div className='grid grid-cols-2 gap-6'>
                  <div className='flex flex-col gap-2'>
                  <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                  <Input name="yearsPlaying" id="yearsPlaying" type="number" placeholder='Tudo bem ser 0'/>
                  </div>

                  <div className='flex flex-col gap-2'>
                  <label htmlFor="discord">Qual seu discord?</label>
                  <Input name="discord" id="discord" type="text" placeholder='Usuário#0000'/>
                  </div>
               </div>

                <div className='flex gap-6'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor="weekDays">Quando costuma jogar?</label>
            
                    <ToogleGroup.Root
                     type='multiple' 
                     className='grid grid-cols-4 gap-2'
                     value={weekDays}
                     onValueChange={setWeekDays}
                     >
                 
                    <ToogleGroup.Item
                     value="0" 
                     title="Domingo"
                     className={`w-8 h-8 rounded ${weekDays.includes('0')? 'bg-violet-500': 'bg-zinc-900 '}`}
                     >D</ ToogleGroup.Item>
                    <ToogleGroup.Item 
                    value="1"
                    className={`w-8 h-8 rounded ${weekDays.includes('1')? 'bg-violet-500': 'bg-zinc-900 '}`} 
                    title='Segunda'>S</ ToogleGroup.Item>
                    <ToogleGroup.Item 
                    value="2" 
                    className={`w-8 h-8 rounded ${weekDays.includes('2')? 'bg-violet-500': 'bg-zinc-900 '}`}
                    title='Terça'>T</ ToogleGroup.Item>
                    <ToogleGroup.Item 
                    value="3" 
                    className={`w-8 h-8 rounded ${weekDays.includes('3')? 'bg-violet-500': 'bg-zinc-900 '}`}
                    title='Quarta'>Q</ ToogleGroup.Item>
                    <ToogleGroup.Item 
                    value="4" 
                    className={`w-8 h-8 rounded ${weekDays.includes('4')? 'bg-violet-500': 'bg-zinc-900 '}`}
                    title='Quinta'>Q</ ToogleGroup.Item>
                    <ToogleGroup.Item 
                    value="5" 
                    className={`w-8 h-8 rounded ${weekDays.includes('5')? 'bg-violet-500': 'bg-zinc-900 '}`}
                    title='Sexta'>S</ ToogleGroup.Item>
                    <ToogleGroup.Item 
                    value="6"
                    className={`w-8 h-8 rounded ${weekDays.includes('6')? 'bg-violet-500': 'bg-zinc-900 '}`}
                    title='Sábado'>S</ ToogleGroup.Item>
                    </ToogleGroup.Root>

                
                </div>

                  <div className='flex flex-col gap-2 flex-1'>
                    <label htmlFor="">Qual horário do dia?</label>
                    <div className='grid grid-cols-2 gap-2'>
                      <Input name="hourStart" id="hourStart" type="time" placeholder='De'/>
                      <Input name="hourEnd" id="hourEnd" type="time" placeholder='Até'/>
                    </div>
                  </div>
              </div>

              <label className='mt-2 flex items-center gap-2 text-sm'>
                <Checkbox.Root 
                className='w-6 h-6 p-1 rounded bg-zinc-900'
                checked={useVoiceChannel}
                onCheckedChange={(checked) =>{
                  if(checked === true){
                    setUseVoiceChannel(true)
                  }else{
                    setUseVoiceChannel(false)
                  }
                }}
                >
                    <Checkbox.Indicator>
                        <Check  className="w-4 h-4 text-emerald-400" />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                Costumo me conectar ao chat de voz
              </label>

              <footer className='mt-4 flex justify-end gap-4'>
                <Dialog.Close 
                type="button"
                className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'>Cancelar
                </Dialog.Close >
                <button 
                className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'
                type='submit'><GameController className='w-6 h-6'/>Encontrar duo</button>
                <ToastContainer />
              </footer>
            </form>
        
        </Dialog.Content>
      </Dialog.Portal>
   
  )
}