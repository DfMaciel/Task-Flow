import { VisualizarAnexo } from "@/types/AnexoInterface";
import Constants from 'expo-constants';
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { useAuth } from "@/app/authcontext";
import api from "@/services/api";

export default function AnexoComponent({ anexo }: { anexo: VisualizarAnexo }) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [isDownloading, setIsDownloading] = useState(false);
    const [base64Data, setBase64Data] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    
    const auth = useAuth();
    const token = auth.userToken;
    
    const { SERVER_ROUTE } = Constants.expoConfig?.extra || {};
    const urlConteudo = `${SERVER_ROUTE}${anexo.urlConteudo}`; 
    const urlBaixar = `${SERVER_ROUTE}${anexo.urlBaixar}`;
    
    const isImagem = anexo.tipo.startsWith('image/');
    const isAudio = anexo.tipo.startsWith('audio/');

    const handleAudioPlayback = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            console.log('Carregando áudio');
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                   { uri: urlConteudo,
                    //  headers: { Authorization: `Bearer ${token}` } 
                    } 
                );
                setSound(newSound);
                console.log('Tocando áudio');
                await newSound.playAsync();
                setIsPlaying(true);

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        setIsPlaying(false);
                        // Optionally unload or rewind
                        // newSound.setPositionAsync(0);
                    }
                });

            } catch (error) {
                console.error("Erro tocando/carregando o áudio:", error);
                alert("Não foi possível carregar o áudio.");
            }
        }
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        Alert.alert("Download", `Baixando ${anexo.nome}...`);

        try {
            const resultado = await api.get(urlBaixar, {
                responseType: 'blob'
            })
            const blob = resultado.data as Blob;
            const reader = new FileReader();

            reader.onloadend = async () => {
                const data = (reader.result as string).split(",")[1];
                const safeName = anexo.nome.replace(/[^a-zA-Z0-9.]/g, "_");
                const fileUri = FileSystem.documentDirectory + safeName;
                await FileSystem.writeAsStringAsync(fileUri, data, {
                encoding: FileSystem.EncodingType.Base64
                });
                Alert.alert("Download concluído", `Arquivo salvo em:\n${fileUri}`);
                setIsDownloading(false);
            };
            reader.readAsDataURL(blob);
            
            // Optional: Share the downloaded file
            // if (await Sharing.isAvailableAsync()) {
            //     await Sharing.shareAsync(downloadedUri);
            // } else {
            //     Alert.alert('Compartilhamento não disponível');
            // }

        } catch (error) {
            console.error('Erro de download:', error);
            Alert.alert('Erro de Download', 'Não foi possível baixar o anexo.');
        } finally {
            setIsDownloading(false);
        }
    }

    useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);

    useEffect(() => {
        if (isImagem) {
            (async () => {
                try {
                  const res = await api.get(anexo.urlConteudo, {
                    responseType: 'blob',
                  });
                  const blob = res.data as Blob;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBase64Data((reader.result as string).split(",")[1]);
                  };
                  reader.readAsDataURL(blob);
                } catch {
                  setBase64Data(null);
                }
              })();
            }
          }, [anexo.urlConteudo]);

      return (
        <View style={styles.itemContainer}>
            {isImagem && base64Data ? (
            <>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <Image
                    source={{ uri: `data:${anexo.tipo};base64,${base64Data}` }}
                    style={styles.thumbnail}
                    />
                </TouchableOpacity>

                <Modal visible={showModal} transparent onRequestClose={() => setShowModal(false)}>
                    <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowModal(false)} />
                    <Image
                        source={{ uri: `data:${anexo.tipo};base64,${base64Data}` }}
                        style={styles.expandedImage}
                        resizeMode="contain"
                    />
                    </View>
                </Modal>
                </>
            ) : isImagem && !base64Data ? (
                <ActivityIndicator size="small" color="#000" />
            ) : isAudio ? (
                <IconButton
                icon={isPlaying ? "pause-circle" : "play-circle"}
                size={40}
                onPress={handleAudioPlayback}
                disabled={isDownloading}
                />
            ) : (
                <IconButton icon="file-outline" size={40} disabled />
            )}

            <Text numberOfLines={1}>
                {anexo.nome}
            </Text>

            <IconButton
                icon="download"
                size={20}
                iconColor="#007AFF" 
                onPress={handleDownload}
                disabled={isDownloading}
                style={styles.downloadButton}
            />
             {isDownloading && <Text style={styles.downloadingText}>Baixando...</Text>}
        </View>
      );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginRight: 10,
        alignItems: 'center',
        width: 120, // Adjust width as needed
        position: 'relative', // For positioning download text/indicator
    },
    anexoImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        marginBottom: 4,
    },
    thumbnail: { 
        width: 100, 
        height: 100, 
        borderRadius: 8, 
        backgroundColor: "#eee" 
    },
    audioContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#f0e7fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
     otherFileContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    anexoFilename: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 2,
    },
    downloadButton: {
        // position: 'absolute', // Optional: Position over the preview
        // top: 5,
        // right: 5,
        // backgroundColor: 'rgba(255,255,255,0.7)',
        margin: 0, // Reset margin if using IconButton default
        padding: 0, // Reset padding
    },
    downloadingText: {
        fontSize: 10,
        color: '#007AFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center"
      },
    expandedImage: { 
        width: "90%", 
        height: "80%" 
    }
});