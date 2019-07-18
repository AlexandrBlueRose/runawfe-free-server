package ru.runa.wfe.chat.logic;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import ru.runa.wfe.chat.ChatMessage;
import ru.runa.wfe.chat.ChatsUserInfo;
import ru.runa.wfe.commons.logic.WfCommonLogic;


@Component
public class ChatLogic extends WfCommonLogic {
    public ChatsUserInfo getUserInfo(long userId,String userName, int chatId) {
        ChatsUserInfo chatUser = chatDao.getUserInfo(userId, userName, chatId);
        return chatUser;
    }
    public long getNewMessagesCount(long lastMessageId, int chatId) {
        return chatDao.getNewMessagesCount(lastMessageId, chatId);
    }
    public void updateUserInfo(long userId,String userName, int chatId, long lastMessageId) {
        chatDao.updateUserInfo(userId, userName, chatId, lastMessageId);
    }
    
    public List<ChatMessage> getMessages(int chatId) {
        List<ChatMessage> messages = chatDao.getAll(chatId);
        return messages;
    }
    
    public ChatMessage getMessage(int chatId, long messageId) {
        return chatDao.getMessage(chatId, messageId);
    }
    
    public List<ChatMessage> getMessages(int chatId,int firstId, int count) {
        List<ChatMessage> messages = chatDao.getMessages(chatId, firstId, count);
        return new ArrayList<ChatMessage>(messages);
    }
    
    public List<ChatMessage> getFirstMessages(int chatId, int count) {
        List<ChatMessage> messages = chatDao.getFirstMessages(chatId,count);
        return messages;
    }
    //возвращает id нового сообщения в БД
    public int setMessage(int chatId, ChatMessage message) {
        Long newId=new Long(-1);
        newId = chatDao.save(message);
        return newId.intValue();
    }
    
    public long getAllMessagesCount(int chatId) {
        return chatDao.getMessagesCount(chatId);
    }
    public void deleteMessage(long messId) {
        chatDao.deleteMessage(messId);
    }
    //функция для связи чатов, добавить сюда подгрузку связей чатов - возвращает связанные id для перенаправления сообщений
    public List<Integer> getAllConnectedChatId(int chatId){
        ArrayList<Integer> chatIds = new ArrayList<Integer>();
        chatIds.add(chatId);
        return chatIds;
    }
}

