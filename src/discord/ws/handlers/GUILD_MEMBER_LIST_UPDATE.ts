import { updateMembers } from "../../../chat/MemberList";
import { DiscordRequestGuildMembers } from "../../discord-classes";
import { DiscordClient } from "../../DiscordClient";

export default function onGuildMemberListUpdate(client: DiscordClient, d: {
    ops: {
        range: [0, 99]
        op: string
        items?: ({
            group: {
                id: string
                count: number
            }
        } | {
            member: any
        })[]
    }[]
    online_count: number
    member_count: number
    id: number
    guild_id: string
    groups: {
        id: string
        count: number
    }[]
}) {
    console.log('Update members')

    const g = client.getGuildPlus(d.guild_id)
    if (!g) return

    g.members = []

    const op = d.ops[0]
    if (op.op !== 'SYNC') return
    g.members.push(...op.items!.filter(i => 'member' in i).map(i => (i as any).member))

    console.log(g.members)

    updateMembers(g.members)

    /*client.ws.send(8, {
        guild_id: [d.guild_id],
        user_ids: []
    } as DiscordRequestGuildMembers)*/
}