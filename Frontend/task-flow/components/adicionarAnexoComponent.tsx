import adicionarAnexo from "@/services/anexos/adicionarAnexo";
import { Audio } from "expo-av";
import { useState } from "react";
import { Alert, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Icon, Menu } from "react-native-paper";

type props = {
    id: number;
    carregarTarefa: () => void;
}

export default function AdicionarAnexoComponent({id, carregarTarefa}: props) {
    const [gravando, setGravando] = useState<Audio.Recording | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => { setMenuVisible(true); };
    const closeMenu = () => { setMenuVisible(false); };
    
    const handleMenuAction = (action: () => Promise<void> | void) => {
        closeMenu();
        action(); 
    };

    const handleAdicionarAnexo = async (uri: string, name: string, tipo: string) => {
        try {
            const resultado = await adicionarAnexo(id, uri, name, tipo);
            console.log("Anexo adicionado successfully:", resultado);
            Alert.alert('Sucesso', 'Anexo adicionado.');
            carregarTarefa();
        } catch (error) {
            console.error(`Error in handleAdicionarAnexo: Name=${name}, Type=${tipo}`, error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao adicionar anexo.';
            Alert.alert('Erro', 'Erro ao adicionar anexo,' + errorMessage);
        }
    };

    const handleEscolherImagem = async () => {
        try {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) 
                return Alert.alert('Permissão necessária', 'Acesso à galeria negado');
            const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
            console.log("ImagePicker result:", JSON.stringify(result, null, 2)); 

            if (result.canceled) 
                return;
            
            if (!result.assets || result.assets.length === 0) {
                console.error("ImagePicker success but no assets found.");
                return Alert.alert('Erro', 'Não foi possível obter a imagem selecionada.');
            }
            const asset = result.assets[0];
            const fileName = asset.fileName ?? `image_${Date.now()}.jpg`;
            const fileType = asset.mimeType ?? `${asset.type}/${asset.uri.split('.').pop()}`;
            console.log(`Image selected: Name=${fileName}, Type=${fileType}, URI=${asset.uri}`);
            await handleAdicionarAnexo(asset.uri, fileName, fileType);
        }
        catch (error) {
            console.error("Error in handleEscolherImagem:", error);
            Alert.alert('Erro', 'Não foi possível escolher a imagem.');
        }
    };
    
    const handleTirarFoto = async () => {
        try {
            const { granted } = await ImagePicker.requestCameraPermissionsAsync();
            if (!granted) 
                return Alert.alert('Permissão necessária', 'Acesso à câmera negado');
            const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'] });
            console.log("ImagePicker result:", JSON.stringify(result, null, 2)); 

            if (result.canceled) 
                return;

            if (!result.assets || result.assets.length === 0) {
                console.error("ImagePicker success but no assets found.");
                return Alert.alert('Erro', 'Não foi possível obter a imagem capturada.');
            }

            const asset = result.assets[0];
            const fileName = asset.fileName ?? `image_${Date.now()}.jpg`;
            const fileType = asset.mimeType ?? `${asset.type}/${asset.uri.split('.').pop()}`;
            console.log(`Photo taken: Name=${fileName}, Type=${fileType}, URI=${asset.uri}`);
            await handleAdicionarAnexo(asset.uri, fileName, fileType);
        } catch (error) {
            console.error("Error in handleTirarFoto:", error);
            Alert.alert('Erro', 'Não foi possível tirar a foto.');
        }
    };

    const handleEscolherAudio = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
            console.log("DocumentPicker result:", JSON.stringify(result, null, 2));

            if (result.canceled) {
                return;
            }
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const uri = asset.uri;
                const name = asset.name;
                const mimeType = asset.mimeType ?? 'audio/mpeg';

                console.log(`Audio selected: Name=${name}, Type=${mimeType}, URI=${uri}`);
                await handleAdicionarAnexo(uri, name, mimeType);
            }
            else {
                console.error("DocumentPicker success but no assets found.");
                Alert.alert('Erro', 'Não foi possível obter o áudio selecionado.');
            }
        } catch (error) {
            console.error("Error in handleEscolherAudio:", error);
            Alert.alert('Erro', 'Não foi possível escolher o áudio.');
        }
    };

    const handleGravarAudio = async () => {
        try {
            if (!gravando) {
                const { granted } = await Audio.requestPermissionsAsync();
                if (!granted) 
                    throw new Error('Permissão de áudio negada');
                const gravacao = new Audio.Recording();
                await gravacao.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
                await gravacao.startAsync();
                setGravando(gravacao);
                console.log("Gravação iniciada:", gravacao.getURI());   
                closeMenu();
      
            } else {
                await gravando.stopAndUnloadAsync();
                const uri = gravando.getURI()!;
                setGravando(null);

                if (!uri) {
                    throw new Error("Failed to get recording URI after stopping.");
                }
                
                await handleAdicionarAnexo(uri, `recording_${Date.now()}.m4a`, 'audio/mp4');
                Alert.alert('Gravação concluída', 'Áudio gravado com sucesso.');
                closeMenu();
            }
        } catch (err) {
            console.error('Erro de gravação:', err);
            Alert.alert('Erro', 'Não foi possível gravar o áudio.');
            if (gravando) {
                try {
                    await gravando.stopAndUnloadAsync();
                } catch (stopError) {
                    console.error('Erro ao parar a gravação:', stopError);
                }
            }
            setGravando(null);
            // closeMenu();
        }
    };

    const handleMainButtonPress = () => {
        if (gravando) {
            handleGravarAudio();
        } else {
            openMenu();
        }
    };
    
    return (
        <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
                <TouchableOpacity 
                    style={[
                        style.addAnexoButton,
                        gravando && style.addAnexoButtonRecording
                    ]}
                    onPress={handleMainButtonPress} 
                >
                <View style={style.addAnexoContent}>
                    <Icon 
                        source={gravando ? "stop-circle-outline" : "plus-circle-outline"} 
                        size={20} 
                        color="#6750A4"
                    />
                    <Text 
                        style={[
                            style.adicionarTitle,
                            gravando && style.adicionarTitleRecording 
                        ]}>
                            {gravando ? "Parar Gravação" : "Adicionar novo anexo"}
                        </Text>
                </View>
            </TouchableOpacity>
            }
        >
            <Menu.Item
                leadingIcon="image-multiple" 
                onPress={() => handleMenuAction(handleEscolherImagem)}
                title="Galeria"
            />
            <Menu.Item
                leadingIcon="camera"
                onPress={() => handleMenuAction(handleTirarFoto)}
                title="Tirar Foto"
            />
            <Menu.Item
                leadingIcon="file-music"
                onPress={() => handleMenuAction(handleEscolherAudio)}
                title="Escolher Áudio"
            />
            <Menu.Item
                leadingIcon={"record-circle-outline"}
                onPress={handleGravarAudio} 
                title={'Gravar Áudio'}
                disabled={!!gravando}
            />
        </Menu>
      );
}

const style = StyleSheet.create ({
    addAnexoButton: {
        backgroundColor: '#f0e7fd', 
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#6750A4',
        transitionProperty: 'background-color, border-color',
        transitionDuration: '0.3s',
    },
    addAnexoButtonRecording: {
        backgroundColor: '#ffebee',
        borderColor: '#FF0000',
    },
    addAnexoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: "#6750A4"
    },
    adicionarTitle: {
        fontSize: 15,
        marginLeft: 8,
        fontWeight: "bold",
        color: "purple"
    },
    adicionarTitleRecording: {
        color: "#FF0000",
    },
});