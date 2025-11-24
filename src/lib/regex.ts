export function hasPing(content: string) {
    // good regex trust
    return /<@!?&?\d{17,22}>/.test(content) || /@everyone/.test(content) || /@here/.test(content);
}

export function mentionRegex(id: string) {
    return new RegExp(`<@!?${id}>`, 'g');
}
