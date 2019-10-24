package ru.runa.wfe.commons.dbpatch.impl;

import java.sql.Types;
import java.util.LinkedList;
import java.util.List;

import ru.runa.wfe.commons.dbpatch.DbPatch;

/**
 * Add tables CHAT_MESSAGE(MESSAGE_ID, TEXT, USER_ID, IERARCHY_MESSAGE, CHAT_ID, Message_Date) and CHATS_USER_INFO(ID, USER_ID, CHAT_ID,
 * LAST_MESSAGE_ID) and Sequences SEQ_CHAT_USER_INFO, SEQ_CHAT_MESSAGE.
 *
 * @since -----
 * @author misharum
 */
public class CreateChatDB extends DbPatch {

    @Override
    protected List<String> getDDLQueriesBefore() {
        List<String> sql = super.getDDLQueriesAfter();
        List<ColumnDef> columns = new LinkedList<DbPatch.ColumnDef>();

        ColumnDef id = new ColumnDef("MESSAGE_ID", Types.BIGINT, false);
        id.setPrimaryKey();

        columns.add(id);
        columns.add(new ColumnDef("TEXT", dialect.getTypeName(Types.VARCHAR, 1024, 1024, 1024), false));
        columns.add(new ColumnDef("USER_ID", dialect.getTypeName(Types.BIGINT), true));
        columns.add(new ColumnDef("IERARCHY_MESSAGE", dialect.getTypeName(Types.VARCHAR, 1024, 1024, 1024), false));
        columns.add(new ColumnDef("CHAT_ID", Types.INTEGER, false));
        columns.add(new ColumnDef("Message_Date", Types.TIMESTAMP, false));
        columns.add(new ColumnDef("HAVE_FILES", Types.BOOLEAN, false));

        sql.add(getDDLCreateTable("CHAT_MESSAGE", columns, null));
        sql.add(getDDLCreateSequence("SEQ_CHAT_MESSAGE"));
        // user-DB
        List<ColumnDef> columns2 = new LinkedList<DbPatch.ColumnDef>();

        ColumnDef id2 = new ColumnDef("ID", Types.BIGINT, false);
        id2.setPrimaryKey();

        columns2.add(new ColumnDef("USER_ID", dialect.getTypeName(Types.BIGINT), true));
        columns2.add(new ColumnDef("CHAT_ID", Types.INTEGER, false));
        columns2.add(id2);
        columns2.add(new ColumnDef("LAST_MESSAGE_ID", Types.BIGINT, false));

        sql.add(getDDLCreateTable("CHATS_USER_INFO", columns2, null));
        sql.add(getDDLCreateSequence("SEQ_CHAT_USER_INFO"));
        // message - files

        List<ColumnDef> columns3 = new LinkedList<DbPatch.ColumnDef>();
        ColumnDef id3 = new ColumnDef("FILE_ID", Types.BIGINT, false);
        id3.setPrimaryKey();
        columns3.add(new ColumnDef("MESSAGE_ID", dialect.getTypeName(Types.BIGINT), true));
        columns3.add(new ColumnDef("FILE", dialect.getTypeName(Types.BLOB), true));
        columns3.add(new ColumnDef("FILE_NAME", dialect.getTypeName(Types.VARCHAR, 1024, 1024, 1024), false));
        columns3.add(id3);

        sql.add(getDDLCreateTable("CHAT_MESSAGE_FILES", columns3, null));
        sql.add(getDDLCreateSequence("SEQ_CHAT_MESSAGE_FILES"));
        // user flag
        // sql.add(getDDLCreateColumn("EXECUTOR", new ColumnDef("IS_CHAT_MESSAGE_TO_EMAILE", Types.BOOLEAN)));

        return sql;
    }

    @Override
    protected List<String> getDDLQueriesAfter() {
        List<String> sql = super.getDDLQueriesAfter();
        sql.add(getDDLCreateForeignKey("CHAT_MESSAGE", "FK_CHAT_MESSAGE_USER", "USER_ID", "EXECUTOR", "ID"));
        sql.add(getDDLCreateForeignKey("CHATS_USER_INFO", "FK_CHATS_USER_INFO_USER", "USER_ID", "EXECUTOR", "ID"));
        sql.add(getDDLCreateForeignKey("CHAT_MESSAGE_FILES", "FK_FILE_CHAT_MESSAGE", "MESSAGE_ID", "CHAT_MESSAGE", "MESSAGE_ID"));
        return sql;
    }
}
