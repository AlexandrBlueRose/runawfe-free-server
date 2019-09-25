package ru.runa.wfe.chat.logic;

import java.util.List;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.stereotype.Component;

import ru.runa.wfe.chat.ChatMessage;
import ru.runa.wfe.chat.ChatMessageFiles;
import ru.runa.wfe.chat.ChatsUserInfo;
import ru.runa.wfe.commons.ClassLoaderUtil;
import ru.runa.wfe.commons.logic.WfCommonLogic;
import ru.runa.wfe.user.Actor;

@Component
public class ChatLogic extends WfCommonLogic {

    private Properties properties = ClassLoaderUtil.getProperties("chat.properties", true);

    public ChatsUserInfo getUserInfo(Actor actor, int chatId) {
        return chatDao.getUserInfo(actor, chatId);
    }

    public long getNewMessagesCount(long lastMessageId, int chatId) {
        return chatDao.getNewMessagesCount(lastMessageId, chatId);
    }

    public void updateUserInfo(Actor actor, int chatId, long lastMessageId) {
        chatDao.updateUserInfo(actor, chatId, lastMessageId);
    }

    public List<ChatMessage> getMessages(int chatId) {
        return chatDao.getAll(chatId);
    }

    public ChatMessage getMessage(long messageId) {
        return chatDao.getMessage(messageId);
    }

    public List<ChatMessage> getMessages(int chatId, int firstId, int count) {
        return chatDao.getMessages(chatId, firstId, count);
    }

    public List<ChatMessage> getFirstMessages(int chatId, int count) {
        return chatDao.getFirstMessages(chatId, count);
    }

    public long setMessage(int chatId, ChatMessage message) {
        return chatDao.save(message);
    }

    public long getAllMessagesCount(int chatId) {
        return chatDao.getMessagesCount(chatId);
    }

    public void deleteMessage(long messId) {
        chatDao.deleteMessage(messId);
    }

    public List<Integer> getAllConnectedChatId(int chatId) {
        return chatDao.getAllConnectedChatId(chatId);
    }

    public List<ChatMessageFiles> getMessageFiles(ChatMessage message) {
        return chatDao.getMessageFiles(message);
    }

    public ChatMessageFiles saveFile(ChatMessageFiles file) {
        return chatDao.saveFile(file);
    }

    public ChatMessageFiles getFile(long fileId) {
        return chatDao.getFile(fileId);
    }

    public void updateMessage(ChatMessage message) {
        chatDao.updateMessage(message);
    }

    public boolean canEditMessage(Actor user) {
        return true;
    }

    public List<Actor> getAllUsersNames(int chatId) {
        return chatDao.getAllUsersNames(chatId);
    }

    public boolean sendMessageToEmail(String title, String message, String Emaile) {
        Properties properties = ClassLoaderUtil.getProperties("chat.properties", true);
        // Создаем соединение для отправки почтового сообщения
        javax.mail.Session session = javax.mail.Session.getDefaultInstance(properties,
                // Аутентификатор - объект, который передает логин и пароль
                new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(
                                properties.getProperty("chat.email.login"), properties.getProperty("chat.email.password"));
                    }
                });
        // Создаем новое почтовое сообщение
        Message mimeMessage = new MimeMessage(session);
        try {
            // От кого
            mimeMessage.setFrom(new InternetAddress(properties.getProperty("chat.email.login")));
            // Кому
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(Emaile));
            // Тема письма
            mimeMessage.setSubject(title);
            // Текст письма
            mimeMessage.setText(message);
            // отправка
            Transport.send(mimeMessage);
        } catch (AddressException e) {
            return false;
        } catch (MessagingException e) {
            return false;
        }
        return true;
    }

}
